import { IDirectiveConfiguration, IControllerConfiguration, IModuleConfiguration, IComponentConfiguration } from './DecoratorConfigs';
import { ModuleConfigurator } from './ModuleConfigurator';
import { Injector } from './Injector';

export function Controller(config?: IControllerConfiguration) {
    return function (target: any) {
        ModuleConfigurator.setController(target, config);
        return target;
    };
}

export function Directive(config?: IDirectiveConfiguration) {
    return function (target: any) {
        ModuleConfigurator.setDirective(target, config);
        return target;
    };
}

export function DirectiveCompileFn() {
    return function (target: any, key: string, descriptor: any) {
        ModuleConfigurator.setDirectiveCompile(target.constructor, descriptor.value);
        return descriptor;
    }
}

export function DirectiveLinkFn() {
    return function (target: any, key: string, descriptor: any) {
        ModuleConfigurator.setDirectiveLink(target.constructor, descriptor.value);
        return descriptor;
    }
}

export function Module(config: IModuleConfiguration) {
    return function (target: any) {
        var module = new ModuleConfigurator(target, config);
        return target
    }
}

export function ModuleConfig() {
    return function (target: any, key: string, descriptor: any) {
        ModuleConfigurator.setModuleConfig(target.constructor, descriptor.value);
        return descriptor;
    };
}

export function ModuleRun() {
    return function (target: any, key: string, descriptor: any) {
        ModuleConfigurator.setModuleRun(target.constructor, descriptor.value);
        return descriptor;
    };
}

export function ModuleValue(name: string, value: any) {
    return function (target: any) {
        ModuleConfigurator.setValue(target, name, value);
        return target;
    };
}

export function ModuleConstant(name: string, value: any) {
    return function (target: any) {
        ModuleConfigurator.setConstant(target, name, value);
        return target;
    };
}

export function Factory(name?: string) {
    return function (target: any) {
        ModuleConfigurator.setFactory(target, name);
        return target;
    };
}

export function Filter(name?: string) {
    return function (target: any) {
        ModuleConfigurator.setFilter(target, name);
        return target;
    };
}

export function FilterFn() {
    return function (target: any, key: string, descriptor: any) {
        ModuleConfigurator.setFilterFn(target.constructor, descriptor.value);
        return descriptor;
    }
}

export function Service(name?: string) {
    return function (target: any) {
        ModuleConfigurator.setService(target, name);
        return target;
    };
}

export function Provider(name?: string) {
    return function (target: any) {
        ModuleConfigurator.setProvider(target, name);
        return target;
    };
}

export function Component(name?: string, config?: IComponentConfiguration){
    return function(target: any){
        ModuleConfigurator.setComponent(target, name, config);
        return target;
    }
}

export function Log() {
    return function (target: any, key: string, descriptor: any) {
        // save a reference to the original method
        // this way we keep the values currently in the 
        // descriptor and don't overwrite what another 
        // decorator might have done to the descriptor.
        var originalMethod = descriptor.value; 

        //editing the descriptor/value parameter
        descriptor.value = function (...args: any[]) {
            var a = args.map(a => JSON.stringify(a, (key, value) => {
                //Remove all Angular properties from serialization => Circular references risk.
                if(key.indexOf('$') == 0)  
                    return undefined;
                    
                return value; 
            })).join();
            // note usage of originalMethod here
            var result = originalMethod.apply(this, args);
            var r = JSON.stringify(result);
            console.log(`Call: ${key}(${a}) => ${r}`);
            return result;
        }

        // return edited descriptor as opposed to overwriting 
        // the descriptor by returning a new descriptor
        return descriptor;
    }
}
