# Angular1 Typescript decorators

Status: In-Development

Write your Angular1 App with Typescript using Decorators.
### Example use:

Instead of doing something like this :

```javascript
angular.module('myModule', [])
        .value('myValue', 'My Text Value')
        .config(['$compileProvider', function($compileProvider){
               $compileProvider.debugInfoEnabled(false); 
        }])
        .run(['myValue', function(myValue){ }])
        .controller('someController', ['$http', '$timeout', '$scope', function($http, $timeout, $scope){
                this.myCtrlFunc = function(){
                        $timeout(function(){
                            console.log('myCtrlFunc');
                        }, 1000);
                }
        }])
        .directive('someDirective', function(){
                return {
                        controller: 'someController',
                        controllerAs: 'myCtrl',
                        link: function($scope, $element, $attrs){ ... }
                }
        });
angular.bootstrap(document, ['myModule']);        
```

You would like to develop like this :

```ts
import { Module, ModuleConfig, ModuleRun, 
        Directive, DirectiveLinkFn, 
        Controller } from '../lib/angular1-typescript-decorators/dist/Decorators';

@Module({
    element: document,
    directives: [SomeDirective],
    config: { strictDi: true }
})
@ModuleValue('myValue', 'My Text value')
class MyModule {
    
    @ModuleConfig()
    config($compileProvider: ng.ICompileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }
    
    @ModuleRun()
    run(myValue){  }
}

@Directive({name: 'someDirective', controller:SomeController, controllerAs:'myCtrl'})
class SomeDirective(){
    @DirectiveLinkFn()
    link($scope, $element, $attrs){ ... }
}

@Controller()
class SomeController{
    constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $scope: ){ }
    
    myCtrlFunc(){
        var $this = this;
        
        $this.$timeout(function(){
            console.log('myCtrlFunc');
        }, 1000);
    }
}
```

This will give you more flexibility with the powerfull of Type script : 
- Intellisense, 
- Compilation,
- Inheritance,
- Type validation,
- and so on..

Further more, do not take care of Angular dependency injection (the decorators will do the stuff for you...) :)

### Install:

```bash
npm install angular1-typescript-decorators --save
```

## Steps to get working on it

Once you've installed the package you are ready to write your first application.

### Create a module

```ts
import { Module } from '../lib/angular1-typescript-decorators/dist/Decorators';
@Module({
    element: document,
    config: { strictDi: true }
})
class MyModule {}
```

This will create an angular module that will be bootstraped in the HTML document.

Remarks : `strictDi: true` will tell to angular to use the strict dependency injection. You don't need to take care about it. The angular1-decorators will configure all your dependencies as required.

### Create a controller
```ts
import { Controller } from '../lib/angular1-typescript-decorators/dist/Decorators';

@Controller()
export class SomeController{
    constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $scope: ){ }
    
    myCtrlFunc(){
        var $this = this;
        
        $this.$timeout(function(){
            console.log('myCtrlFunc');
        }, 1000);
    }
}
```

This will create an angular controller called ```someController```. 

Remarks, once that's done, you'll have to register your controller in the module (using the module decorator), or set it as a dependency of a directive. The decorators will include the controller in the module on its own.

### Create a directive
```ts
import { Directive, DirectiveLinkFn } from '../lib/angular1-typescript-decorators/dist/Decorators';

@Directive({name: 'myDirective'})
export class SomeDirective(){
    @DirectiveLinkFn()
    link($scope, $element, $attrs){ ... }
}
```

This will create an angular directive called ```myDirective```.
By default directive names are camelCased, so if you don't provide a custom name, this directive will be called ```someDirective```.

Remarks, once that's done, you'll have to register your directive in the module (using the module decorator).

### Create a service

```ts
import { Service, Log } from '../lib/angular1-typescript-decorators/dist/Decorators';

@Service('customService')
export class MyService{
    constructor(private $http: ng.IHttpService) { }
    
    @Log()
    myServiceFunction(){
        return this.$http.get('/my/api/url')
                        .success(function(result: Array<any>){
                            return result.map(x => {
                                id: x.ID,
                                name: x.Label
                            });
                        });
    }
}
```
This will create an angular service called ```customService```. By default service names are camelCased, so if you don't provide a custom name, this service will be called ```myService```.

Remarks, once that's done, you'll have to register your service in the module (using the module decorator).
The service could be used in controller for example just by adding it into the constructor dependencies (just use the right name :) )

#### Example

```ts
import { Controller } from '../lib/angular1-typescript-decorators/dist/Decorators';
import { MyService } from '../services/MyService'

@Controller()
export class SomeController{
    constructor(private customService: MyService ){ }
    
    myCtrlFunc(){
        var $this = this;
        
        $this.customService.myServiceFunction()
            .then(function(result: Array<any>){
                // service called
            })
        
    }
}
```

### Logging

Angular typescripts decorators contains also a ```Log``` decorator that could be use in order to add some logging aspect to your methods. This will add in your favorite debugger console the name of your methods, input parameters and result value each time this method will be called. 

At this time the Log decorator doesn't work for injected methods like constructors, ModuleRun methods, DirectiveLinkFn, and so on. I 'll work on it in order to be able to add some log in anything.

## License

[MIT License](http://ilee.mit-license.org)
