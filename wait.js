/**
 * Copyright (C) 2011 by Jakub Siberski
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy
 *of this software and associated documentation files (the "Software"), to deal
 *in the Software without restriction, including without limitation the rights
 *to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *copies of the Software, and to permit persons to whom the Software is
 *furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in
 *all copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *THE SOFTWARE.
 */
 

var WAIT = (function() {
        var module = {};
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
                log("started wait with stepID " + that.intervalID + " and timeoutID " + that.timeoutID);
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
                log("started wait with stepID " + that.intervalID + " and timeoutID " + that.timeoutID);
            };
        };

        return module;
    }());