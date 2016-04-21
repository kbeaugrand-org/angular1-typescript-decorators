System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Injector;
    function buildParamMetadataKey(index) {
        return ':p_' + index;
    }
    return {
        setters:[],
        execute: function() {
            Injector = (function () {
                function Injector() {
                }
                Injector.inject = function (target, injectInline) {
                    this.markAsInjectable(target);
                    var params = this.resolveParamNames(target);
                    if (!injectInline) {
                        target.$inject = params;
                        return;
                    }
                    params.push(target);
                    return params;
                };
                Injector.markAsInjectable = function (target) {
                    var args = target.toString()
                        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '')
                        .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
                        .split(/,/)
                        .filter(function (x) { return x != ''; })
                        .map(function (x) { return x; });
                    Reflect.defineMetadata("design:paramtypes", args, target);
                };
                Injector.resolveParamNames = function (target, methodName) {
                    var metadata = Reflect.getMetadata("design:paramtypes", target, methodName);
                    if (!metadata)
                        return [];
                    return metadata;
                };
                return Injector;
            }());
            exports_1("Injector", Injector);
        }
    }
});
//# sourceMappingURL=Injector.js.map