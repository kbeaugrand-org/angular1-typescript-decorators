import { camelize } from './Tools';

function buildParamMetadataKey(index: number) {
    return ':p_' + index;
}

export class Injector {
    static inject(target: any, injectInline?: boolean) {
        this.markAsInjectable(target);

        var params = this.resolveParamNames(target);
        if (!injectInline) {
            target.$inject = params;
            return;
        }

        params.push(target);

        return params;
    }

    private static markAsInjectable(target) {
        var args = target.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '')
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
            .split(/,/)
            .filter(x => x!= '')
            .map(x => { return x });

        Reflect.defineMetadata("design:paramtypes", args, target);
    }

    private static resolveParamNames(target: Function, methodName?: string): string[] {
        var metadata: Array<string> = Reflect.getMetadata("design:paramtypes", target, methodName);

        if (!metadata)
            return [];

        return metadata;
    }
}