var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
    var cmdLine = document.querySelector(cmdLineContainer);
    var output  = document.querySelector(outputContainer);

    const CMDS = [
        'clear', 'date', 'echo', 'help', 'uname'
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

            var input = line.querySelector('input.cmdline');
            input.autofocus = false;
            input.readOnly  = true;

            output.appendChild(line);

            if (this.value && this.value.trim()) {
                var args = this.value.split(' ').filter(function (val, i) {
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
                this.value = '';
                return;
            case 'date':
                write(new Date());
                break;
            case 'echo':
                write(args.join(' '));
                break;
            case 'help':
                write('<div class="ls-files">' + CMDS.join('<br>') + '</div>');
                break;
            case 'uname':
                write(navigator.appVersion);
                break;
            default:
                if (cmd) {
                    write(cmd + ': command not found');
                }
        };
    }

    return {
        init: function () {
            write('<h2>Visualiser Console</h2><p>' + new Date() + '</p><p>Enter "help" for more information.</p>');
        },
        write: write // so we can print out stuff
    }
};

var terminalInstance;
jQuery(function() {
    jQuery('.prompt').html('[input] # ');

    // Initialize a new terminal object
    terminalInstance = new Terminal('#input-line .cmdline', '#wrapper output');
    terminalInstance.init();
});