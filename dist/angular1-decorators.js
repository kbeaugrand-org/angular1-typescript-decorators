System.register("DecoratorConfigs", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("Tools", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }
    exports_2("camelize", camelize);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("Injector", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
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
            exports_3("Injector", Injector);
        }
    }
});
System.register("ModuleConfigurator", ["Injector", "Tools"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Injector_1, Tools_1;
    var metadataTypes, ModuleConfigurator;
    return {
        setters:[
            function (Injector_1_1) {
                Injector_1 = Injector_1_1;
            },
            function (Tools_1_1) {
                Tools_1 = Tools_1_1;
            }],
        execute: function() {
            metadataTypes = {
                targetName: 'target:name',
                moduleValues: 'module:value',
                moduleConstant: 'module:constant',
                moduleConfig: 'module:config',
                moduleRun: 'module:run',
                directiveConfig: 'directive:config',
                directiveCompile: 'directive:compileFn',
                directiveLink: 'directive:link',
            };
            ModuleConfigurator = (function () {
                function ModuleConfigurator(target, module) {
                    this.target = target;
                    this.module = module;
                    this.moduleName = module.name;
                    if (!this.moduleName)
                        this.moduleName = Tools_1.camelize(target.name);
                    Reflect.defineMetadata(metadataTypes.targetName, this.moduleName, target);
                    if (!module.dependencies)
                        module.dependencies = [];
                    var depedencies = module.dependencies;
                    if (module.moduleDependencies && module.moduleDependencies.length)
                        module = _.union(depedencies, module.moduleDependencies.map(function (x) { return Reflect.getMetadata(metadataTypes.targetName, x); }));
                    var app = angular.module(this.moduleName, depedencies);
                    this.configureValues(app, target);
                    this.configureFactories(app, module);
                    this.configureControllers(app, module);
                    this.configureDirectives(app, module);
                    this.configureFilters(app, module);
                    this.configureServices(app, module);
                    this.configureProviders(app, module);
                    var configBlock = Reflect.getMetadata(metadataTypes.moduleConfig, target);
                    if (configBlock)
                        app.config(configBlock);
                    var runBlock = Reflect.getMetadata(metadataTypes.moduleRun, target);
                    if (runBlock)
                        app.run(runBlock);
                    if (angular.element)
                        angular.bootstrap(module.element, [this.moduleName], module.config);
                }
                ModuleConfigurator.setValue = function (target, valueName, value) {
                    var values = Reflect.getMetadata(metadataTypes.moduleValues, target);
                    if (!values)
                        values = [];
                    values.push({ key: valueName, value: value });
                    Reflect.defineMetadata(metadataTypes.moduleValues, values, target);
                };
                ModuleConfigurator.setConstant = function (target, valueName, value) {
                    var constants = Reflect.getMetadata(metadataTypes.moduleConstant, target);
                    if (!constants)
                        constants = [];
                    constants.push({ key: valueName, value: value });
                    Reflect.defineMetadata(metadataTypes.moduleConstant, constants, target);
                };
                ModuleConfigurator.setModuleConfig = function (target, configurator) {
                    Reflect.defineMetadata(metadataTypes.moduleConfig, Injector_1.Injector.inject(configurator, true), target);
                };
                ModuleConfigurator.setModuleRun = function (target, runBlock) {
                    Reflect.defineMetadata(metadataTypes.moduleRun, Injector_1.Injector.inject(runBlock, true), target);
                };
                ModuleConfigurator.setDirective = function (target, config) {
                    Injector_1.Injector.inject(target);
                    Reflect.defineMetadata(metadataTypes.directiveConfig, config, target);
                };
                ModuleConfigurator.setController = function (target, name) {
                    Injector_1.Injector.inject(target);
                    Reflect.defineMetadata(metadataTypes.targetName, name, target);
                };
                ModuleConfigurator.setService = function (target, name) {
                    Injector_1.Injector.inject(target);
                    Reflect.defineMetadata(metadataTypes.targetName, name, target);
                };
                ModuleConfigurator.setFactory = function (target, name) {
                    Injector_1.Injector.inject(target);
                    Reflect.defineMetadata(metadataTypes.targetName, name, target);
                };
                ModuleConfigurator.setFilter = function (target, name) {
                    Injector_1.Injector.inject(target);
                    Reflect.defineMetadata(metadataTypes.targetName, name, target);
                };
                ModuleConfigurator.setDirectiveCompile = function (target, compile) {
                    Reflect.defineMetadata(metadataTypes.directiveCompile, compile, target);
                };
                ModuleConfigurator.setDirectiveLink = function (target, compile) {
                    Reflect.defineMetadata(metadataTypes.directiveLink, compile, target);
                };
                ModuleConfigurator.setProvider = function (target, name) {
                    Reflect.defineMetadata(metadataTypes.targetName, name, target);
                };
                ModuleConfigurator.prototype.addController = function (app, target) {
                    var controllerName = this.getTargetName(target);
                    console.debug("Registering Controller '" + controllerName + "'");
                    app.controller(controllerName, target);
                    return controllerName;
                };
                ModuleConfigurator.prototype.getTargetName = function (target) {
                    var name = Reflect.getMetadata(metadataTypes.targetName, target);
                    if (name)
                        return name;
                    return Tools_1.camelize(target.name);
                };
                ModuleConfigurator.prototype.configureValues = function (app, target) {
                    var values = Reflect.getMetadata(metadataTypes.moduleValues, target);
                    if (!values || !values.length)
                        return;
                    values.forEach(function (x) {
                        console.debug("Registering Value '" + x.key + "'");
                        app.value(x.key, x.value);
                    });
                };
                ModuleConfigurator.prototype.configureConstants = function (app, target) {
                    var constants = Reflect.getMetadata(metadataTypes.moduleConstant, target);
                    if (!constants || !constants.length)
                        return;
                    constants.forEach(function (x) {
                        console.debug("Registering Constant '" + x.key + "'");
                        app.constant(x.key, x.value);
                    });
                };
                ModuleConfigurator.prototype.configureServices = function (app, config) {
                    var _this = this;
                    if (!config.services || !config.services.length)
                        return;
                    config.services.forEach(function (x) {
                        console.debug("Registering Service '" + _this.getTargetName(x) + "'");
                        app.service(_this.getTargetName(x), x);
                    });
                };
                ModuleConfigurator.prototype.configureControllers = function (app, config) {
                    var _this = this;
                    if (!config.controllers || !config.controllers.length)
                        return;
                    config.controllers.forEach(function (x) {
                        _this.addController(app, x);
                    });
                };
                ModuleConfigurator.prototype.configureProviders = function (app, config) {
                    var _this = this;
                    if (!config.providers || !config.providers.length)
                        return;
                    config.providers.forEach(function (x) {
                        x.prototype.$get = Injector_1.Injector.inject(x.prototype.$get, true);
                        console.debug("Registering Provider '" + _this.getTargetName(x) + "'");
                        app.provider(_this.getTargetName(x), x);
                    });
                };
                ModuleConfigurator.prototype.configureFactories = function (app, config) {
                    var _this = this;
                    if (!config.factories || !config.factories.length)
                        return;
                    config.factories.forEach(function (x) {
                        console.debug("Registering Factory '" + _this.getTargetName(x) + "'");
                        app.factory(_this.getTargetName(x), x);
                    });
                };
                ModuleConfigurator.prototype.configureFilters = function (app, config) {
                    var _this = this;
                    if (!config.filters || !config.filters.length)
                        return;
                    config.filters.forEach(function (x) {
                        console.debug("Registering Filter '" + _this.getTargetName(x) + "'");
                        app.filter(_this.getTargetName(x), x);
                    });
                };
                ModuleConfigurator.prototype.configureDirectives = function (app, config) {
                    var _this = this;
                    if (!config.directives || !config.directives.length)
                        return;
                    config.directives.forEach(function (target) {
                        var directiveConfig = Reflect.getMetadata(metadataTypes.directiveConfig, target);
                        var compileFn = Reflect.getMetadata(metadataTypes.directiveCompile, target);
                        var linkFn = Reflect.getMetadata(metadataTypes.directiveLink, target);
                        if (!directiveConfig)
                            return;
                        var directive = {
                            restrict: directiveConfig.restrict,
                            controllerAs: directiveConfig.controllerAs,
                            multiElement: directiveConfig.multiElement,
                            priority: directiveConfig.priority,
                            name: directiveConfig.name,
                            scope: directiveConfig.scope,
                            template: directiveConfig.template,
                            templateNamespace: directiveConfig.templateNamespace,
                            templateUrl: directiveConfig.templateUrl,
                            terminal: directiveConfig.terminal,
                            transclude: directiveConfig.transclude
                        };
                        if (directiveConfig.controller)
                            directive.controller = _this.addController(app, directiveConfig.controller);
                        if (compileFn)
                            directive.compile = compileFn;
                        if (linkFn)
                            directive.link = linkFn;
                        var directiveName = directiveConfig.name;
                        if (!directiveName)
                            directiveName = _this.getTargetName(target);
                        console.debug("Registering Directive '" + directiveName + "'");
                        app.directive(directiveName, function () {
                            return directive;
                        });
                    });
                };
                return ModuleConfigurator;
            }());
            exports_4("ModuleConfigurator", ModuleConfigurator);
        }
    }
});
System.register("Decorators", ["ModuleConfigurator"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var ModuleConfigurator_1;
    function Controller() {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setController(target);
            return target;
        };
    }
    exports_5("Controller", Controller);
    function Directive(config) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setDirective(target, config);
            return target;
        };
    }
    exports_5("Directive", Directive);
    function DirectiveCompileFn() {
        return function (target, key, descriptor) {
            ModuleConfigurator_1.ModuleConfigurator.setDirectiveCompile(target.constructor, descriptor.value);
            return descriptor;
        };
    }
    exports_5("DirectiveCompileFn", DirectiveCompileFn);
    function DirectiveLinkFn() {
        return function (target, key, descriptor) {
            ModuleConfigurator_1.ModuleConfigurator.setDirectiveLink(target.constructor, descriptor.value);
            return descriptor;
        };
    }
    exports_5("DirectiveLinkFn", DirectiveLinkFn);
    function Module(config) {
        return function (target) {
            var module = new ModuleConfigurator_1.ModuleConfigurator(target, config);
            return target;
        };
    }
    exports_5("Module", Module);
    function ModuleConfig() {
        return function (target, key, descriptor) {
            ModuleConfigurator_1.ModuleConfigurator.setModuleConfig(target.constructor, descriptor.value);
            return descriptor;
        };
    }
    exports_5("ModuleConfig", ModuleConfig);
    function ModuleRun() {
        return function (target, key, descriptor) {
            ModuleConfigurator_1.ModuleConfigurator.setModuleRun(target.constructor, descriptor.value);
            return descriptor;
        };
    }
    exports_5("ModuleRun", ModuleRun);
    function ModuleValue(name, value) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setValue(target, name, value);
            return target;
        };
    }
    exports_5("ModuleValue", ModuleValue);
    function ModuleConstant(name, value) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setConstant(target, name, value);
            return target;
        };
    }
    exports_5("ModuleConstant", ModuleConstant);
    function Factory(name) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setFactory(target, name);
            return target;
        };
    }
    exports_5("Factory", Factory);
    function Filter(name) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setFilter(target, name);
            return target;
        };
    }
    exports_5("Filter", Filter);
    function Service(name) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setService(target, name);
            return target;
        };
    }
    exports_5("Service", Service);
    function Provider(name) {
        return function (target) {
            ModuleConfigurator_1.ModuleConfigurator.setProvider(target, name);
            return target;
        };
    }
    exports_5("Provider", Provider);
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
    exports_5("Log", Log);
    return {
        setters:[
            function (ModuleConfigurator_1_1) {
                ModuleConfigurator_1 = ModuleConfigurator_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=angular1-decorators.js.map