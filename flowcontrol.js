/** @pragma content raw */
/** @globals WAIT, console */

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