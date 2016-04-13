/// <reference path="../bower_components/reflect-metadata/typings.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
declare module "DecoratorConfigs" {
    export interface IModuleConfiguration {
        name?: string;
        element?: string | Element | JQuery | Document;
        dependencies?: Array<string>;
        moduleDependencies?: Array<any>;
        config?: ng.IAngularBootstrapConfig;
        controllers?: Array<any>;
        filters?: Array<any>;
        factories?: Array<any>;
        services?: Array<any>;
        directives?: Array<any>;
        configurations?: Array<any>;
        providers?: Array<any>;
    }
    export interface IDirectiveConfiguration {
        controller?: any;
        controllerAs?: string;
        multiElement?: boolean;
        name?: string;
        priority?: number;
        restrict?: string;
        scope?: boolean | Object;
        template?: string | Function;
        templateNamespace?: string;
        templateUrl?: string | Function;
        terminal?: boolean;
        transclude?: boolean | string | {
            [slot: string]: string;
        };
    }
}
declare module "Tools" {
    export function camelize(str: any): any;
}
declare module "Injector" {
    export class Injector {
        static inject(target: any, injectInline?: boolean): string[];
        private static markAsInjectable(target);
        private static resolveParamNames(target, methodName?);
    }
}
declare module "ModuleConfigurator" {
    import { IModuleConfiguration, IDirectiveConfiguration } from "DecoratorConfigs";
    export class ModuleConfigurator {
        private target;
        private module;
        moduleName: string;
        constructor(target: any, module: IModuleConfiguration);
        static setValue(target: any, valueName: string, value: any): void;
        static setConstant(target: any, valueName: string, value: any): void;
        static setModuleConfig(target: any, configurator: any): void;
        static setModuleRun(target: any, runBlock: any): void;
        static setDirective(target: any, config?: IDirectiveConfiguration): void;
        static setController(target: any, name?: string): void;
        static setService(target: any, name?: string): void;
        static setFactory(target: any, name?: string): void;
        static setFilter(target: any, name?: string): void;
        static setDirectiveCompile(target: any, compile: any): void;
        static setDirectiveLink(target: any, compile: any): void;
        static setProvider(target: any, name?: string): void;
        private addController(app, target);
        private getTargetName(target);
        private configureValues(app, target);
        private configureConstants(app, target);
        private configureServices(app, config);
        private configureControllers(app, config);
        private configureProviders(app, config);
        private configureFactories(app, config);
        private configureFilters(app, config);
        private configureDirectives(app, config);
    }
}
declare module "Decorators" {
    import { IDirectiveConfiguration, IModuleConfiguration } from "DecoratorConfigs";
    export function Controller(): (target: any) => any;
    export function Directive(config?: IDirectiveConfiguration): (target: any) => any;
    export function DirectiveCompileFn(): (target: any, key: string, descriptor: any) => any;
    export function DirectiveLinkFn(): (target: any, key: string, descriptor: any) => any;
    export function Module(config: IModuleConfiguration): (target: any) => any;
    export function ModuleConfig(): (target: any, key: string, descriptor: any) => any;
    export function ModuleRun(): (target: any, key: string, descriptor: any) => any;
    export function ModuleValue(name: string, value: any): (target: any) => any;
    export function ModuleConstant(name: string, value: any): (target: any) => any;
    export function Factory(name?: string): (target: any) => any;
    export function Filter(name?: string): (target: any) => any;
    export function Service(name?: string): (target: any) => any;
    export function Provider(name?: string): (target: any) => any;
    export function Log(): (target: any, key: string, descriptor: any) => any;
}
