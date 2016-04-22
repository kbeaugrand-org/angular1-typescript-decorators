System.register(['./ModuleConfigurator'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ModuleConfigurator_1;
    function Controller(config) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setController(target, config);
            return target;
        };
    }
    exports_1("Controller", Controller);
    function Directive(config) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setDirective(target, config);
            return target;
        };
    }
    exports_1("Directive", Directive);
    function DirectiveCompileFn() {
        return function (target, key, descriptor) {
            ModuleConfigurator_1.ModuleConfigurator.setDirectiveCompile(target.constructor, descriptor.value);
            return descriptor;
        };
    }
    exports_1("DirectiveCompileFn", DirectiveCompileFn);
    function DirectiveLinkFn() {
        return function (target, key, descriptor) {
            ModuleConfigurator_1.ModuleConfigurator.setDirectiveLink(target.constructor, descriptor.value);
            return descriptor;
        };
    }
    exports_1("DirectiveLinkFn", DirectiveLinkFn);
    function Module(config) {
        return function (target) {
            var module = new ModuleConfigurator_1.ModuleConfigurator(target, config);
            return target;
        };
    }
    exports_1("Module", Module);
    function ModuleConfig() {
        return function (target, key, descriptor) {
            ModuleConfigurator_1.ModuleConfigurator.setModuleConfig(target.constructor, descriptor.value);
            return descriptor;
        };
    }
    exports_1("ModuleConfig", ModuleConfig);
    function ModuleRun() {
        return function (target, key, descriptor) {
            ModuleConfigurator_1.ModuleConfigurator.setModuleRun(target.constructor, descriptor.value);
            return descriptor;
        };
    }
    exports_1("ModuleRun", ModuleRun);
    function ModuleValue(name, value) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setValue(target, name, value);
            return target;
        };
    }
    exports_1("ModuleValue", ModuleValue);
    function ModuleConstant(name, value) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setConstant(target, name, value);
            return target;
        };
    }
    exports_1("ModuleConstant", ModuleConstant);
    function Factory(name) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setFactory(target, name);
            return target;
        };
    }
    exports_1("Factory", Factory);
    function Filter(name) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setFilter(target, name);
            return target;
        };
    }
    exports_1("Filter", Filter);
    function Service(name) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setService(target, name);
            return target;
        };
    }
    exports_1("Service", Service);
    function Provider(name) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setProvider(target, name);
            return target;
        };
    }
    exports_1("Provider", Provider);
    function Log() {
        return function (target, key, descriptor) {
            var originalMethod = descriptor.value;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var a = args.map(function (a) { return JSON.stringify(a); }).join();
                var result = originalMethod.apply(this, args);
                var r = JSON.stringify(result);
                console.log("Call: " + key + "(" + a + ") => " + r);
                return result;
            };
            return descriptor;
        };
    }
    exports_1("Log", Log);
    return {
        setters:[
            function (ModuleConfigurator_1_1) {
                ModuleConfigurator_1 = ModuleConfigurator_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=Decorators.js.map