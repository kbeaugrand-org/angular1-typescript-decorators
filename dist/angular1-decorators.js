var Reflect;
(function (Reflect) {
    "use strict";
    var functionPrototype = Object.getPrototypeOf(Function);
    var _Map = typeof Map === "function" ? Map : CreateMapPolyfill();
    var _Set = typeof Set === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    var __Metadata__ = new _WeakMap();
    function decorate(decorators, target, targetKey, targetDescriptor) {
        if (!IsUndefined(targetDescriptor)) {
            if (!IsArray(decorators)) {
                throw new TypeError();
            }
            else if (!IsObject(target)) {
                throw new TypeError();
            }
            else if (IsUndefined(targetKey)) {
                throw new TypeError();
            }
            else if (!IsObject(targetDescriptor)) {
                throw new TypeError();
            }
            targetKey = ToPropertyKey(targetKey);
            return DecoratePropertyWithDescriptor(decorators, target, targetKey, targetDescriptor);
        }
        else if (!IsUndefined(targetKey)) {
            if (!IsArray(decorators)) {
                throw new TypeError();
            }
            else if (!IsObject(target)) {
                throw new TypeError();
            }
            targetKey = ToPropertyKey(targetKey);
            return DecoratePropertyWithoutDescriptor(decorators, target, targetKey);
        }
        else {
            if (!IsArray(decorators)) {
                throw new TypeError();
            }
            else if (!IsConstructor(target)) {
                throw new TypeError();
            }
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    function metadata(metadataKey, metadataValue) {
        function decorator(target, targetKey) {
            if (!IsUndefined(targetKey)) {
                if (!IsObject(target)) {
                    throw new TypeError();
                }
                targetKey = ToPropertyKey(targetKey);
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
            }
            else {
                if (!IsConstructor(target)) {
                    throw new TypeError();
                }
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, undefined);
            }
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    function defineMetadata(metadataKey, metadataValue, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
    }
    Reflect.defineMetadata = defineMetadata;
    function hasMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryHasMetadata(metadataKey, target, targetKey);
    }
    Reflect.hasMetadata = hasMetadata;
    function hasOwnMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryHasOwnMetadata(metadataKey, target, targetKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    function getMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryGetMetadata(metadataKey, target, targetKey);
    }
    Reflect.getMetadata = getMetadata;
    function getOwnMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryGetOwnMetadata(metadataKey, target, targetKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    function getMetadataKeys(target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryMetadataKeys(target, targetKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    function getOwnMetadataKeys(target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryOwnMetadataKeys(target, targetKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    function deleteMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        var metadataMap = GetOrCreateMetadataMap(target, targetKey, false);
        if (IsUndefined(metadataMap)) {
            return false;
        }
        if (!metadataMap.delete(metadataKey)) {
            return false;
        }
        if (metadataMap.size > 0) {
            return true;
        }
        var targetMetadata = __Metadata__.get(target);
        targetMetadata.delete(targetKey);
        if (targetMetadata.size > 0) {
            return true;
        }
        __Metadata__.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated)) {
                if (!IsConstructor(decorated)) {
                    throw new TypeError();
                }
                target = decorated;
            }
        }
        return target;
    }
    function DecoratePropertyWithDescriptor(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated)) {
                if (!IsObject(decorated)) {
                    throw new TypeError();
                }
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function DecoratePropertyWithoutDescriptor(decorators, target, propertyKey) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            decorator(target, propertyKey);
        }
    }
    function GetOrCreateMetadataMap(target, targetKey, create) {
        var targetMetadata = __Metadata__.get(target);
        if (!targetMetadata) {
            if (!create) {
                return undefined;
            }
            targetMetadata = new _Map();
            __Metadata__.set(target, targetMetadata);
        }
        var keyMetadata = targetMetadata.get(targetKey);
        if (!keyMetadata) {
            if (!create) {
                return undefined;
            }
            keyMetadata = new _Map();
            targetMetadata.set(targetKey, keyMetadata);
        }
        return keyMetadata;
    }
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn) {
            return true;
        }
        var parent = GetPrototypeOf(O);
        if (parent !== null) {
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        }
        return false;
    }
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, false);
        if (metadataMap === undefined) {
            return false;
        }
        return Boolean(metadataMap.has(MetadataKey));
    }
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn) {
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        }
        var parent = GetPrototypeOf(O);
        if (parent !== null) {
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        }
        return undefined;
    }
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, false);
        if (metadataMap === undefined) {
            return undefined;
        }
        return metadataMap.get(MetadataKey);
    }
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = GetPrototypeOf(O);
        if (parent === null) {
            return ownKeys;
        }
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0) {
            return ownKeys;
        }
        if (ownKeys.length <= 0) {
            return parentKeys;
        }
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    function OrdinaryOwnMetadataKeys(target, targetKey) {
        var metadataMap = GetOrCreateMetadataMap(target, targetKey, false);
        var keys = [];
        if (metadataMap) {
            metadataMap.forEach(function (_, key) { return keys.push(key); });
        }
        return keys;
    }
    function IsUndefined(x) {
        return x === undefined;
    }
    function IsArray(x) {
        return Array.isArray(x);
    }
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    function IsConstructor(x) {
        return typeof x === "function";
    }
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    function ToPropertyKey(value) {
        if (IsSymbol(value)) {
            return value;
        }
        return String(value);
    }
    function GetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype) {
            return proto;
        }
        if (proto !== functionPrototype) {
            return proto;
        }
        var prototype = O.prototype;
        var prototypeProto = Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype) {
            return proto;
        }
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function") {
            return proto;
        }
        if (constructor === O) {
            return proto;
        }
        return constructor;
    }
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        function Map() {
            this._keys = [];
            this._values = [];
            this._cache = cacheSentinel;
        }
        Map.prototype = {
            get size() {
                return this._keys.length;
            },
            has: function (key) {
                if (key === this._cache) {
                    return true;
                }
                if (this._find(key) >= 0) {
                    this._cache = key;
                    return true;
                }
                return false;
            },
            get: function (key) {
                var index = this._find(key);
                if (index >= 0) {
                    this._cache = key;
                    return this._values[index];
                }
                return undefined;
            },
            set: function (key, value) {
                this.delete(key);
                this._keys.push(key);
                this._values.push(value);
                this._cache = key;
                return this;
            },
            delete: function (key) {
                var index = this._find(key);
                if (index >= 0) {
                    this._keys.splice(index, 1);
                    this._values.splice(index, 1);
                    this._cache = cacheSentinel;
                    return true;
                }
                return false;
            },
            clear: function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cache = cacheSentinel;
            },
            forEach: function (callback, thisArg) {
                var size = this.size;
                for (var i = 0; i < size; ++i) {
                    var key = this._keys[i];
                    var value = this._values[i];
                    this._cache = key;
                    callback.call(this, value, key, this);
                }
            },
            _find: function (key) {
                var keys = this._keys;
                var size = keys.length;
                for (var i = 0; i < size; ++i) {
                    if (keys[i] === key) {
                        return i;
                    }
                }
                return -1;
            }
        };
        return Map;
    }
    function CreateSetPolyfill() {
        var cacheSentinel = {};
        function Set() {
            this._map = new _Map();
        }
        Set.prototype = {
            get size() {
                return this._map.length;
            },
            has: function (value) {
                return this._map.has(value);
            },
            add: function (value) {
                this._map.set(value, value);
                return this;
            },
            delete: function (value) {
                return this._map.delete(value);
            },
            clear: function () {
                this._map.clear();
            },
            forEach: function (callback, thisArg) {
                this._map.forEach(callback, thisArg);
            }
        };
        return Set;
    }
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var isNode = typeof global !== "undefined" && Object.prototype.toString.call(global.process) === '[object process]';
        var nodeCrypto = isNode && require("crypto");
        var hasOwn = Object.prototype.hasOwnProperty;
        var keys = {};
        var rootKey = CreateUniqueKey();
        function WeakMap() {
            this._key = CreateUniqueKey();
        }
        WeakMap.prototype = {
            has: function (target) {
                var table = GetOrCreateWeakMapTable(target, false);
                if (table) {
                    return this._key in table;
                }
                return false;
            },
            get: function (target) {
                var table = GetOrCreateWeakMapTable(target, false);
                if (table) {
                    return table[this._key];
                }
                return undefined;
            },
            set: function (target, value) {
                var table = GetOrCreateWeakMapTable(target, true);
                table[this._key] = value;
                return this;
            },
            delete: function (target) {
                var table = GetOrCreateWeakMapTable(target, false);
                if (table && this._key in table) {
                    return delete table[this._key];
                }
                return false;
            },
            clear: function () {
                this._key = CreateUniqueKey();
            }
        };
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i) {
                buffer[i] = Math.random() * 255 | 0;
            }
        }
        function GenRandomBytes(size) {
            if (nodeCrypto) {
                var data = nodeCrypto.randomBytes(size);
                return data;
            }
            else if (typeof Uint8Array === "function") {
                var data = new Uint8Array(size);
                if (typeof crypto !== "undefined") {
                    crypto.getRandomValues(data);
                }
                else if (typeof msCrypto !== "undefined") {
                    msCrypto.getRandomValues(data);
                }
                else {
                    FillRandomBytes(data, size);
                }
                return data;
            }
            else {
                var data = new Array(size);
                FillRandomBytes(data, size);
                return data;
            }
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8) {
                    result += "-";
                }
                if (byte < 16) {
                    result += "0";
                }
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
        function CreateUniqueKey() {
            var key;
            do {
                key = "@@WeakMap@@" + CreateUUID();
            } while (hasOwn.call(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create) {
                    return undefined;
                }
                Object.defineProperty(target, rootKey, { value: Object.create(null) });
            }
            return target[rootKey];
        }
        return WeakMap;
    }
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    __global.Reflect[p] = Reflect[p];
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof window !== "undefined" ? window :
        typeof WorkerGlobalScope !== "undefined" ? self :
            typeof global !== "undefined" ? global :
                Function("return this;")());
})(Reflect || (Reflect = {}));
System.register("src/DecoratorConfigs", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("src/Tools", [], function(exports_2, context_2) {
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
System.register("src/Injector", [], function(exports_3, context_3) {
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
System.register("src/ModuleConfigurator", ["src/Injector", "src/Tools"], function(exports_4, context_4) {
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
                        module = depedencies.concat(module.moduleDependencies.map(function (x) { return Reflect.getMetadata(metadataTypes.targetName, x); }));
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
System.register("src/Decorators", ["src/ModuleConfigurator"], function(exports_5, context_5) {
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