export declare class Injector {
    static inject(target: any, injectInline?: boolean): string[];
    private static markAsInjectable(target);
    private static resolveParamNames(target, methodName?);
}
