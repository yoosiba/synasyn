/** @pragma content raw */
/** @globals window, console */

var WAIT = (function() {

        module.Wait = function(predicate, predicate_arguments, action, id) {
            this.intervalID = null;
            this.timeoutID = null;
            this.stopPredicate = predicate;
            this.argumentsPredicate = (typeof predicate_arguments === undefined) ? []: predicate_arguments;
            this.doAction = action;
            this.checkTimeStep = 100;
            this.waitTimeOut = 50000;
            this.ID = (typeof id === undefined) ? new Date().getTime() : id;
            var that = this;

            function log(data) {
                console.log("Wait<" + that.ID + ">:: " + data);
            }

            function stopInterval() {
                log("END_WAIT::clear interval_" + that.intervalID + " and timeout_" + that.timeoutID);
                window.clearInterval(that.intervalID);
                window.clearTimeout(that.timeoutID);
            }

            function forceStopInterval() {
                log("FORCE_END_WAIT::" + that.intervalID);
                window.clearInterval(that.intervalID);
            }

            function stopCondition() {
                log("action condition is = " + that.stopPredicate());
                if (that.stopPredicate.apply(null, that.argumentsPredicate)) {
                    stopInterval();
                    that.doAction();
                }
            }

            this.now = function() {
                that.intervalID = window.setInterval(stopCondition, that.checkTimeStep);
                that.timeoutID = window.setTimeout(forceStopInterval, that.waitTimeOut);
                log("started wait with stepID " + that.intervalID + " and timeoutID " + that.timeoutID)
            };
        };

        module.WaitWithCallback = function(predicate,predicateArguments, action, actionArguments, callback, id) {
            this.intervalID = null;
            this.timeoutID = null;
            this.stopPredicate = predicate;
            this.withPredicateArguments = (typeof predicateArguments === undefined) ? []: predicateArguments;
            this.doAction = action;
            this.withArguments = actionArguments;
            this.callback = callback;
            this.checkTimeStep = 100;
            this.waitTimeOut = 50000;
            var that = this;
            this.ID = (typeof id === undefined) ? new Date().getTime() : id;

            function log(data) {
                console.log("Wait<" + that.ID + ">:: " + data);
            }

            function stopInterval() {
                log("END_WAIT::clear interval_" + that.intervalID + " and timeout_" + that.timeoutID);
                window.clearInterval(that.intervalID);
                window.clearTimeout(that.timeoutID);
            }

            function forceStopInterval() {
                log("FORCE_END_WAIT::" + that.intervalID);
                window.clearInterval(that.intervalID);
                that.callback();
            }

            function stopCondition() {
                log("action condition is = " + that.stopPredicate());
                if (that.stopPredicate.apply(null, that.withPredicateArguments)) {
                    stopInterval();
                    that.doAction.apply(null, that.withArguments);
                    that.callback();
                }
            }

            this.now = function() {
                that.intervalID = window.setInterval(stopCondition, that.checkTimeStep);
                that.timeoutID = window.setTimeout(forceStopInterval, that.waitTimeOut);
                log("started wait with stepID " + that.intervalID + " and timeoutID " + that.timeoutID)
            };
        };

        return module;
    }());