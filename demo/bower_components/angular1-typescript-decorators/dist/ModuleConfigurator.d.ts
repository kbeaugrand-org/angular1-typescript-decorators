/// <reference path="../typings/tsd.d.ts" />
import { IModuleConfiguration, IDirectiveConfiguration, IControllerConfiguration } from './DecoratorConfigs';
export declare class ModuleConfigurator {
    private target;
    private module;
    moduleName: string;
    constructor(target: any, module: IModuleConfiguration);
    static setValue(target: any, valueName: string, value: any): void;
    static setConstant(target: any, valueName: string, value: any): void;
    static setModuleConfig(target: any, configurator: any): void;
    static setModuleRun(target: any, runBlock: any): void;
    static setDirective(target: any, config?: IDirectiveConfiguration): void;
    static setController(target: any, config?: IControllerConfiguration): void;
    static setService(target: any, name?: string): void;
    static setFactory(target: any, name?: string): void;
    static setFilter(target: any, name?: string): void;
    static setFilterFn(target: any, name?: string): void;
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
