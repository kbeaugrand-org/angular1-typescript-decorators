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
