export interface IModuleConfiguration {
    name?: string;
    route?: string;
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
export interface IControllerRouteDefinition {
    template?: string;
    templateUrl?: string;
    path?: string;
    controllerAs?: string;
    resolve?: any;
    redirectTo?: string;
    resolveAs?: string;
    caseInsensitiveMatch?: boolean;
    reloadOnSearch?: boolean;
}
export interface IControllerConfiguration {
    name?: string;
    route?: IControllerRouteDefinition;
}
