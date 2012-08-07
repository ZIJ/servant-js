/**
 * Created with JetBrains WebStorm.
 * User: ZIJ
 * Date: 8.08.12
 * Time: 1:01
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created with JetBrains WebStorm.
 * User: ZIJ
 * Date: 8.08.12
 * Time: 0:48
 * To change this template use File | Settings | File Templates.
 */

/**
 * Instantiates a new Servant
 * @param handlers - object, should have on() and off() methods, both accepting callback and calling it when done.
 * @constructor
 */
function Servant(handlers) {
    // flags
    var available = false;
    var fulfillScheduled = false;
    // not yet released requirements
    var requirements = [];
    // for debugging purposes only
    this.reqs = function () {
        return requirements;
    };
    // executes callback as soon as servant is available
    this.require = function (callback, about) {
        // creating requirement
        var req = new Requirement(callback, onRelease, about);
        // registering requirement
        requirements.push(req);
        // scheduling requirements fulfill when available
        if (false === available && false === fulfillScheduled) {
            fulfillScheduled = true;
            handlers.on(onAvailable);
            // fulfilling immediately
        } else if (true === available) {
            req.fulfill();
        }
        return req;
        // is executed when servant comes
        function onAvailable() {
            available = true;
            // fulfilling all requirements
            for (var i in requirements) {
                requirements[i].fulfill();
            }
            fulfillScheduled = false;
        }
        // is executed when requirement is released
        function onRelease() {
            if (requirements.every(isReleased)) {
                requirements = [];      // cleaning
                fulfillScheduled = false;
                available = false;      // leaving
                handlers.off();         // waving goodbye :)
            }
        }
        // checks release state of requirement
        function isReleased(requirement) {
            return (true === requirement.released);
        }

    };

    /**
     * Instantiates new Requirement - kind of a handler union
     * @param onAvailable
     * @param onRelease
     * @param about
     * @constructor
     */
    function Requirement(onAvailable, onRelease, about) {
        this.about = about;
        // flags
        this.fulfilled = false;
        this.released = false;
        // executes onAvailable (only once)
        this.fulfill = function () {
            if (false === this.fulfilled) {
                this.fulfilled = true;
                callIfFunc(onAvailable);
            }
        };
        // executes onRelease (only once)
        this.release = function () {
            if (false === this.released) {
                this.fulfilled = true;
                this.released = true;
                onRelease();
            }
        }
    }

    /**
     * Calls function if it is a function :)
     * @param f
     */
    function callIfFunc(f) {
        if (typeof (f) === 'function') {
            f();
        }
    }
}

