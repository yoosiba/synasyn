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
 
 
var FLOWCONTROL = (function() {
        var module = {};
        module.CommandLink = function(action, action_arguments, predicate, predicate_arguments,  callback, id) {
            this.action = action;
            this.actionArguments = action_arguments;
            this.callback = callback;
            this.predicate = predicate;
            this.predicate_arguments = predicate_arguments;
            this.actionFinished = false;
            this.id = id;
            var that = this;

            function isActionFinished() {
                return that.actionFinished;
            }

            function setActionFinished() {
                that.actionFinished = true;
            }

            this.executeAction = new WAIT.WaitWithCallback(predicate,predicate_arguments,
                action, action_arguments, setActionFinished, "WaitingForAction_" + id);
            this.executeAfterAction = new WAIT.Wait(isActionFinished, [], 
                callback, "FinishingWaitFor_" + id);
            

            this.execute = function() {
                that.executeAfterAction.now();  
                that.executeAction.now();
            };
        };

        module.CommandChain = function() {
            this.chain = [];
            this.buffor = [];
            var that = this;

            this.pushFunction = function(func, func_args, condition, condition_args, id) {
                that.buffor.push([func, func_args, (typeof condition === undefined) ? function(){return true;}: condition, (typeof condition_args === undefined) ? [] : condition_args, (typeof id === undefined) ? new Date().getTime() : id]);
            };

            this.buildChain = function() {
                var bl = that.buffor.length - 1;
                that.chain.push(new FLOWCONTROL.CommandLink(that.buffor[bl][0], that.buffor[bl][1], that.buffor[bl][2], that.buffor[bl][3], function() {}, that.buffor[bl][4]));
                var i = null;
                for (i = bl - 1; i >= 0; i--) {
                    that.chain.push(new FLOWCONTROL.CommandLink(that.buffor[i][0], that.buffor[i][1], that.buffor[i][2], that.buffor[i][3], that.chain[that.chain.length - 1].execute, that.buffor[i][4]));
                }
                that.chain[that.chain.length - 1].execute();
            };
        };

        return module;
    }());