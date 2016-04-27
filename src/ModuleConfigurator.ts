/// <reference path="../typings/tsd.d.ts" />
import { IModuleConfiguration, IDirectiveConfiguration, IControllerConfiguration } from './DecoratorConfigs'
import { Injector } from './Injector';
import { camelize } from './Tools';

var metadataTypes = {
    targetName: 'target:name',
    moduleValues: 'module:value',
    moduleConstant: 'module:constant',
    moduleConfig: 'module:config',
    moduleRun: 'module:run',
    controllerConfig: 'controller:config',
    directiveConfig: 'directive:config',
    directiveCompile: 'directive:compileFn',
    directiveLink: 'directive:link',
}

export class ModuleConfigurator {
    moduleName: string;
    constructor(private target: any, private module: IModuleConfiguration) {
        this.moduleName = module.name;

        if (!this.moduleName)
            this.moduleName = camelize(target.name);

        Reflect.defineMetadata(metadataTypes.targetName, this.moduleName, target);

        if (!module.dependencies)
            module.dependencies = [];

        var depedencies = module.dependencies;

        if (module.moduleDependencies && module.moduleDependencies.length)
            depedencies = depedencies.concat(module.moduleDependencies.map(x => Reflect.getMetadata(metadataTypes.targetName, x)));

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

    static setValue(target: any, valueName: string, value: any) {
        var values: Array<any> = Reflect.getMetadata(metadataTypes.moduleValues, target);
        if (!values)
            values = [];

        values.push({ key: valueName, value: value });
        Reflect.defineMetadata(metadataTypes.moduleValues, values, target);
    }

    static setConstant(target: any, valueName: string, value: any) {
        var constants: Array<any> = Reflect.getMetadata(metadataTypes.moduleConstant, target);
        if (!constants)
            constants = [];

        constants.push({ key: valueName, value: value });
        Reflect.defineMetadata(metadataTypes.moduleConstant, constants, target);
    }

    static setModuleConfig(target: any, configurator: any) {
        Reflect.defineMetadata(metadataTypes.moduleConfig, Injector.inject(configurator, true), target);
    }

    static setModuleRun(target: any, runBlock: any) {
        Reflect.defineMetadata(metadataTypes.moduleRun, Injector.inject(runBlock, true), target);
    }

    static setDirective(target: any, config?: IDirectiveConfiguration) {
        Injector.inject(target);
        Reflect.defineMetadata(metadataTypes.directiveConfig, config, target);
    }

    static setController(target: any, config?: IControllerConfiguration) {
        Injector.inject(target);
        Reflect.defineMetadata(metadataTypes.controllerConfig, config, target);
    }

    static setService(target: any, name?: string) {
        Injector.inject(target);
        Reflect.defineMetadata(metadataTypes.targetName, name, target);
    }

    static setFactory(target: any, name?: string) {
        Injector.inject(target);
        Reflect.defineMetadata(metadataTypes.targetName, name, target);
    }

    static setFilter(target: any, name?: string) {
        Injector.inject(target);
        Reflect.defineMetadata(metadataTypes.targetName, name, target);
    }

    static setDirectiveCompile(target: any, compile: any) {
        Reflect.defineMetadata(metadataTypes.directiveCompile, compile, target);
    }

    static setDirectiveLink(target: any, compile: any) {
        Reflect.defineMetadata(metadataTypes.directiveLink, compile, target);
    }

    static setProvider(target: any, name?: string) {
        Reflect.defineMetadata(metadataTypes.targetName, name, target);
    }

    private addController(app: ng.IModule, target: any) {
        var controllerConfig = Reflect.getMetadata(metadataTypes.controllerConfig, target);
        var controllerName = '';
        
        if(controllerConfig && controllerConfig.name)
             controllerName = controllerConfig.name;

        if (!controllerName)
            controllerName = this.getTargetName(target);

        console.debug(`Registering Controller '${controllerName}'`);
        app.controller(controllerName, target);

        return controllerName;
    }

    private getTargetName(target: any): string {
        var name = Reflect.getMetadata(metadataTypes.targetName, target);

        if (name)
            return name;

        return camelize(target.name);
    }
    private configureValues(app: ng.IModule, target: any) {
        var values: Array<any> = Reflect.getMetadata(metadataTypes.moduleValues, target);
        if (!values || !values.length)
            return

        values.forEach(x => {
            console.debug(`Registering Value '${x.key}'`);
            app.value(x.key, x.value);
        });
    }

    private configureConstants(app: ng.IModule, target: any) {
        var constants: Array<any> = Reflect.getMetadata(metadataTypes.moduleConstant, target);
        if (!constants || !constants.length)
            return

        constants.forEach(x => {
            console.debug(`Registering Constant '${x.key}'`);
            app.constant(x.key, x.value);
        });
    }

    private configureServices(app: ng.IModule, config: IModuleConfiguration) {
        if (!config.services || !config.services.length)
            return;

        config.services.forEach(x => {
            console.debug(`Registering Service '${this.getTargetName(x)}'`);
            app.service(this.getTargetName(x), x);
        });
    }

    private configureControllers(app: ng.IModule, config: IModuleConfiguration) {
       
        if (!config.controllers || !config.controllers.length)
            return;

        var controllers = config.controllers.map(x => {
            return {
               controllerName: this.addController(app, x),
               target: x
            };
        });
        
        try{
            if(angular.module("ngRoute"))
            { 
                app.config(['$routeProvider', function($routeProvider: ng.route.IRouteProvider){
                    controllers.forEach(x => {
                        var controllerName = x.controllerName;
                        var controllerConfig: IControllerConfiguration = Reflect.getMetadata(metadataTypes.controllerConfig, x.target);
                        
                        if(!controllerConfig.route)
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
        catch(e) {}
    }

    private configureProviders(app: ng.IModule, config: IModuleConfiguration) {
        if (!config.providers || !config.providers.length)
            return;

        config.providers.forEach(x => {
            x.prototype.$get = Injector.inject(x.prototype.$get, true);
            console.debug(`Registering Provider '${this.getTargetName(x)}'`);
            app.provider(this.getTargetName(x), x);
        });
    }

    private configureFactories(app: ng.IModule, config: IModuleConfiguration) {
        if (!config.factories || !config.factories.length)
            return;

        config.factories.forEach(x => {
            console.debug(`Registering Factory '${this.getTargetName(x)}'`);
            app.factory(this.getTargetName(x), x);
        });
    }

    private configureFilters(app: ng.IModule, config: IModuleConfiguration) {
        if (!config.filters || !config.filters.length)
            return;

        config.filters.forEach(x => {
            console.debug(`Registering Filter '${this.getTargetName(x)}'`);
            app.filter(this.getTargetName(x), x);
        });
    }

    private configureDirectives(app: ng.IModule, config: IModuleConfiguration) {
        if (!config.directives || !config.directives.length)
            return;

        config.directives.forEach(target => {
            var directiveConfig: IDirectiveConfiguration = Reflect.getMetadata(metadataTypes.directiveConfig, target);
            var compileFn = Reflect.getMetadata(metadataTypes.directiveCompile, target);
            var linkFn = Reflect.getMetadata(metadataTypes.directiveLink, target);

            if (!directiveConfig)
                return;

            var directive: ng.IDirective = {
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
                directive.controller = this.addController(app, directiveConfig.controller);

            if (compileFn)
                directive.compile = compileFn

            if (linkFn)
                directive.link = linkFn;

            var directiveName = directiveConfig.name;

            if (!directiveName)
                directiveName = this.getTargetName(target);

            console.debug(`Registering Directive '${directiveName}'`);
            app.directive(directiveName, function () {
                return directive;
            });
        });
    }
}