let LoggerFactory = (function () {
    function Logger() {
        this.STORAGE_KEY = "logs";
        this.PREFIX      = "[LOGS]";

        localStorage[this.STORAGE_KEY] = "";

        this.generateStamp = function () {
            return '(' + new Date().toLocaleString() + ')';
        }

        this.print = function () {
            console.log(this.PREFIX, this.generateStamp(), ...arguments);
        }

        this.log = function (str) {
            localStorage[this.STORAGE_KEY] += `${this.generateStamp()} ${str}`;     
        }

        this.logln = function (str) {
            localStorage[this.STORAGE_KEY] += `${this.generateStamp()} ${str}\n`;     
        }
    }

    let instance;

    return {
        getInstance: function () {
            if (instance == null) {
                instance = new Logger();
                // Hide the constructor so the returned object can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
    };
})();

module.exports = LoggerFactory;