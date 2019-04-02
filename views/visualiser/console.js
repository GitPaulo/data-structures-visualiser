/* global activeItem, activeOperation, jQuery, util, codeFollowEditor, metaTable, visualisationCanvas, logger */

var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
    var cmdLine = document.querySelector(cmdLineContainer);
    var output = document.querySelector(outputContainer);

    const CMDS = [
        'clear', 'echo', 'help', 'instructions', 'scale',
        'showcontrols', "shouldreset", "resetosc", "speed", "extralogs",
        'insert', 'remove', 'search', 'sort'
    ];

    const ANIMATION_CMDS = [
        ...metaTable.operationControls
    ];

    var history = [];
    var histpos = 0;
    var histtemp = 0;

    cmdLine.addEventListener('click', inputTextClick, false);
    cmdLine.addEventListener('keydown', historyHandler, false);
    cmdLine.addEventListener('keydown', processNewCommand, false);

    function inputTextClick() {
        this.value = this.value;
    }

    function historyHandler(e) {
        if (history.length) {
            if (e.keyCode == 38 || e.keyCode == 40) {
                if (history[histpos]) {
                    history[histpos] = this.value;
                } else {
                    histtemp = this.value;
                }
            }

            if (e.keyCode == 38) { // up
                histpos--;
                if (histpos < 0) {
                    histpos = 0;
                }
            } else if (e.keyCode == 40) { // down
                histpos++;
                if (histpos > history.length) {
                    histpos = history.length;
                }
            }

            if (e.keyCode == 38 || e.keyCode == 40) {
                this.value = history[histpos] ? history[histpos] : histtemp;
                let that = this;
                // sets focus on end of string
                setTimeout(function () {
                    that.selectionStart = that.selectionEnd = 10000;
                }, 0);
            }
        }
    }

    function processNewCommand(e) {
        if (e.keyCode == 9) { // tab
            e.preventDefault();
            // Implement tab suggest.
        } else if (e.keyCode == 13) { // enter
            // Save shell history.
            if (this.value) {
                history[history.length] = this.value;
                histpos = history.length;
            }

            // Duplicate current input and append to output section.
            var line = this.parentNode.parentNode.cloneNode(true);
            line.removeAttribute('id')
            line.classList.add('line');

            var input = line.querySelector('input.cmdline');
            input.autofocus = false;
            input.readOnly = true;

            output.appendChild(line);

            if (this.value && this.value.trim()) {
                var args = this.value.split(/[ ,]+/).filter(function (val, i) { // split by space and comma
                    return val;
                });
                var cmd = args[0].toLowerCase();
                args = args.splice(1); // Remove cmd from arg list.
            }

            execCMD(cmd, args);

            window.scrollTo(0, getDocHeight());
            this.value = ''; // Clear/setup line for next input.
        }
    }

    function write(html, shouldLog=true) {
        output.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
        if(shouldLog) logger.logln(html);
    }

    function getDocHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    function performItemOperation(key, args) {
        if (activeItem === null)
            return write('There is no selected data structure to perform an operation on!');

        if (typeof activeItem[key] === "undefined")
            return write(`No operation function for ${key} found for this data structure!`);

        if (activeOperation.inProgress)
            return write("Currently there is an active operation in progress!");

        let argumentsList = util.getParamNames(activeItem[key]); // always the operator!
        let n1 = args.length;
        let n2 = argumentsList.length;

        if (n1 < n2)
            return write(`Invalid number of arguments - Expected ${n2} got ${n1}!`);

        let originalFuncReference;
        let operationCoroutine;

        // Multi operations support: 
        // Operation methods with multiple functions (Sort: bubble,insertion,...) will return the coroutine object of the appropiate method!
        if (activeItem[key].constructor.name !== "AsyncGeneratorFunction") {
            let rdata = activeItem[key](...args);
            logger.print({
                rdata
            });
            if (rdata.success) {
                originalFuncReference = rdata.coroutine;
                args = [...rdata.args];
                operationCoroutine = originalFuncReference.bind(activeItem);
            } else {
                return write(rdata.message);
            }
        } else {
            originalFuncReference = activeItem[key];
            operationCoroutine = originalFuncReference.bind(activeItem); // required because changing reference storage.
        }

        write(`Performing '${key}' operation on '${activeItem.id}' with parameters: [${args+""}]`);

        logger.print({
            argumentsList,
            operationCoroutine,
            originalFuncReference
        });
        // Update code follow
        codeFollowEditor.setCode(originalFuncReference);

        // Data Structure Operation Call
        activeOperation.assign(operationCoroutine(...args));
        activeOperation.resume();
    }

    function execCMD(cmd, args) {
        // for operations with anim control
        if (ANIMATION_CMDS.indexOf(cmd.toLowerCase()) > -1) {
            activeOperation[cmd](...args);
            return;
        }

        switch (cmd) {
            case 'clear':
                output.innerHTML = '';
                this.value = '';
                break;
            case 'echo':
                write(args.join(' '));
                break;
            case 'help':
                let allCommands = CMDS.concat(ANIMATION_CMDS);
                write('<div class="ls-files">' + allCommands.join('<br>') + '</div>');
                break;
            case 'instructions':
                if (activeItem === null) {
                    write("No active item! Please select a DS from the side bar.");
                    break;
                }

                let objectProperties = util.getPrototypeKeys(activeItem);
                let help = `${activeItem.id} - Command Operation Instructions<br>[<b>cmd arg1,...,argN</b> => "description"]<br><br>`;

                for (let property of objectProperties) {
                    let hax = activeItem.__proto__[property];
                    if (typeof hax === "undefined")
                        continue;

                    let params = util.getParamNames(hax) + "";
                    params = params === "" ? "(none)" : params;

                    let helpStr = hax.help;
                    if (helpStr) {
                        help += `<b>\u2023 ${property} ${params} </b>=> "${helpStr}"<br>`;
                    }
                }

                write(help);
                break;
            case 'scale':
                visualisationCanvas.SCALE_MLT = args[0];
                write(`Setting canvas scale multiplier to: ${args[0]}`);
                break;
            case 'extralogs':
                if (activeItem === null) {
                    write("No active item! Please select one from the sidebar before setting it's flags.");
                    break;
                }

                activeItem.extralogs = !activeItem.extralogs;
                write(`Informative logs for '${activeItem.constructor.name}' set to: <b>${activeItem.extralogs}</b>`);
                break;
            case 'showcontrols':
                let controlsElement = document.getElementById("visualisation_controls");
                controlsElement.style.display = controlsElement.style.display === "block" ? "none" : "block";
                write(`Set display property of the controls to: <b>${controlsElement.style.display}</b>`);
                break;
            case 'shouldreset':
                activeOperation.shouldReset = !activeOperation.shouldReset;
                write(`Animation state reset post opreation set to: <b>${activeOperation.shouldReset}</b>`);
                break;
            case 'resetosc':
                activeOperation.resetOnSC = !activeOperation.resetOnSC;
                write(`Animation state reset post opreation (only on success) set to: <b>${activeOperation.resetOnSC}</b>`);
                break;
            case 'speed':
                activeOperation.setSpeed(...args);
                break;
            case 'insert':
            case 'remove':
            case 'search':
            case 'sort':
                performItemOperation(cmd, args);
                break;
            default:
                if (cmd) {
                    write(cmd + ': command not found');
                }
        }
    }

    return {
        init: function () {
            write('<h2>Visualiser Console</h2><p id="date_console">' + new Date() + '</p><p>Enter "help" for more console command information.</p><p>Enter "instructions" for data structure specific operation help!</p>', false);
            let consoleTimeElement = document.getElementById("date_console")
            window.setInterval(function () { // might cause problems!
                consoleTimeElement.innerHTML = new Date();
            }, 1000);
        },
        write: write // so we can print out stuff
    }
};

var terminalInstance;
jQuery(function () {
    jQuery('.prompt').html('> ');

    // Initialize a new terminal object
    terminalInstance = new Terminal('#input-line .cmdline', '#wrapper output');
    terminalInstance.init();
});