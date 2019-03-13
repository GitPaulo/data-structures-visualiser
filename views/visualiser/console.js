var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
    var cmdLine = document.querySelector(cmdLineContainer);
    var output  = document.querySelector(outputContainer);

    const CMDS = [
        'clear', 'date', 'echo', 
        'help', 'instructions',
        'uname', 'showcontrols',
        'insert', 'remove', 'search', 'sort'
    ];

    var fs       = null;
    var cwd      = null;
    var history  = [];
    var histpos  = 0;
    var histtemp = 0;

    cmdLine.addEventListener('click', inputTextClick, false);
    cmdLine.addEventListener('keydown', historyHandler, false);
    cmdLine.addEventListener('keydown', processNewCommand, false);

    function inputTextClick(e) {
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
                this.value = this.value; // Sets cursor to end of input.
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

            var input       = line.querySelector('input.cmdline');
            input.autofocus = false;
            input.readOnly  = true;

            output.appendChild(line);

            if (this.value && this.value.trim()) {
                var args = this.value.split(/[ ,]+/).filter(function (val, i) { // split by space and comma
                    return val;
                });
                var cmd = args[0].toLowerCase();
                args    = args.splice(1); // Remove cmd from arg list.
            }

            execCMD(cmd, args);

            window.scrollTo(0, getDocHeight());
            this.value = ''; // Clear/setup line for next input.
        }
    }

    function formatColumns(entries) {
        var maxName = entries[0].name;
        util.toArray(entries).forEach(function (entry, i) {
            if (entry.name.length > maxName.length) {
                maxName = entry.name;
            }
        });

        var height = entries.length <= 3 ?
            'height: ' + (entries.length * 15) + 'px;' : '';

        // 12px monospace font yields ~7px screen width.
        var colWidth = maxName.length * 7;

        return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'
        ];
    }

    function write(html) {
        output.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
    }

    function getDocHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    function execCMD(cmd, args) {
        switch (cmd) {
            case 'clear':
                output.innerHTML = '';
                this.value       = '';
                break;
            case 'date':
                write(new Date());
                break;
            case 'echo':
                write(args.join(' '));
                break;
            case 'help':
                write('<div class="ls-files">' + CMDS.join('<br>') + '</div>');
                break;
            case 'instructions':
                if (activeItem === null){
                    write("No active item! Please select a DS from the side bar.");
                    break;
                }

                let objectProperties = Object.getOwnPropertyNames(activeItem.__proto__);
                let help             = `${activeItem.id} - Command Operation Instructions<br>[<b>cmd arg1,...,argN</b> => "description"]<br><br>`;
                
                for (let property of objectProperties){
                    let hax = activeItem.__proto__[property];
                    if (typeof hax === "undefined")
                        continue;

                    let params  = util.getParamNames(hax) + "";
                    params      = params === "" ? "(none)" : params;

                    let helpStr = hax.help;
                    if (helpStr) {
                        help += `<b>\u2023 ${property} ${params} </b>=> "${helpStr}"<br>`;
                    }
                }

                write(help);
                break
            case 'uname':
                write(navigator.appVersion);
                break;
            case 'showcontrols':
                let controlsElement = document.getElementById("visualisation_controls");
                controlsElement.style.display = controlsElement.style.display === "block" ? "none" : "block";
                write(`Set display property of the controls to: ${controlsElement.style.display}`);
                break;
            case 'insert':
                if (activeItem === null)
                    return write('There is no selected data structure to perform an operation on!');
                
                // Copy operation code to editor
                codeFollowEditor.setCode(activeItem.insert);

                try {
                    write(`Performing insert operation on '${activeItem.id}' with parameters: ${args+""}`);
                    activeItem.insert(...args).then((result)=>{
                        write(result.message);
                        codeFollowEditor.resetCode();
                    });
                } catch (error) {
                    write(error);    
                }    
                
                break;
            case 'remove':
                if (activeItem === null)
                    return write('There is no selected data structure to perform an operation on!');

                // Copy operation code to editor
                codeFollowEditor.setCode(activeItem.remove);

                try {
                    write(`Performing remove operation on '${activeItem.id}' with parameters: ${args+""}`);
                    activeItem.remove(...args).then((result)=>{
                        write(result.message);
                        codeFollowEditor.resetCode();
                    });
                } catch (error) {
                    write(error);    
                }

                break;
            case 'search':
                if (activeItem === null)
                    return write('There is no selected data structure to perform an operation on!');

                // Copy operation code to editor
                codeFollowEditor.setCode(activeItem.search);

                try {
                    write(`Performing search operation on '${activeItem.id}' with parameters: ${args+""}`);
                    activeItem.search(...args).then((result) => {
                        write(result.message);
                        codeFollowEditor.resetCode();
                    });
                } catch (error) {
                    write(error);    
                }

                break;
            case 'sort':
                if (activeItem === null)
                    return write('There is no selected data structure to perform an operation on!');

                // Copy operation code to editor
                codeFollowEditor.setCode(activeItem.sort);

                try {
                    write(`Performing sort operation on '${activeItem.id}' with parameters: ${args+""}`);
                    activeItem.sort(...args).then((result) => {
                        write(result.message);
                        codeFollowEditor.resetCode();
                    });
                } catch (error) {
                    write(error);    
                }

                break;
            default:
                if (cmd) {
                    write(cmd + ': command not found');
                }
        };
    }

    return {
        init: function () {
            write('<h2>Visualiser Console</h2><p id="date_console">' + new Date() + '</p><p>Enter "help" for more information.</p>');
            let consoleTimeElement = document.getElementById("date_console")
            window.setInterval(function(){ // might cause problems!
                consoleTimeElement.innerHTML = new Date();
            }, 1000);
        },
        write: write // so we can print out stuff
    }
};

var terminalInstance;
jQuery(function() {
    jQuery('.prompt').html('> ');

    // Initialize a new terminal object
    terminalInstance = new Terminal('#input-line .cmdline', '#wrapper output');
    terminalInstance.init();
});