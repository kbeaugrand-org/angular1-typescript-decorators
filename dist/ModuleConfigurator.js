System.register(['./Injector', './Tools'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
                controllerConfig: 'controller:config',
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
                        depedencies = depedencies.concat(module.moduleDependencies.map(function (x) { return Reflect.getMetadata(metadataTypes.targetName, x); }));
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
                    if (angular.element && module.element)
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
                ModuleConfigurator.setController = function (target, config) {
                    Injector_1.Injector.inject(target);
                    Reflect.defineMetadata(metadataTypes.controllerConfig, config, target);
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
                    var controllerConfig = Reflect.getMetadata(metadataTypes.controllerConfig, target);
                    var controllerName = '';
                    if (controllerConfig && controllerConfig.name)
                        controllerName = controllerConfig.name;
                    if (!controllerName)
                        controllerName = this.getTargetName(target);
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
                    var controllers = config.controllers.map(function (x) {
                        return {
                            controllerName: _this.addController(app, x),
                            target: x
                        };
                    });
                    try {
                        if (angular.module("ngRoute")) {
                            app.config(['$routeProvider', function ($routeProvider) {
                                    controllers.forEach(function (x) {
                                        var controllerName = x.controllerName;
                                        var controllerConfig = Reflect.getMetadata(metadataTypes.controllerConfig, x.target);
                                        if (!controllerConfig.route)
                                            return;
                                        var path = URI(config.route)
                                            .directory(controllerConfig.route.path)
                                            .path();
                                        $routeProvider.when(path, {
                                            caseInsensitiveMatch: controllerConfig.route.caseInsensitiveMatch,
                                            controller: controllerName,
                                            controllerAs: controllerConfig.route.controllerAs,
                                            name: controllerName,
                                            redirectTo: controllerConfig.route.redirectTo,
                                            reloadOnSearch: controllerConfig.route.reloadOnSearch,
                                            resolve: controllerConfig.route.resolve,
                                            template: controllerConfig.route.template,
                                            templateUrl: controllerConfig.route.templateUrl
                                        });
                                    });
                                }]);
                        }
                    }
                    catch (e) { }
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
            exports_1("ModuleConfigurator", ModuleConfigurator);
        }
    }
});
