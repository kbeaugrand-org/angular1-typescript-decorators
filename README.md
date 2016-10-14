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
    constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $scope: ng.IScope){ }
    
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

## Install:
### Via npm

```bash
npm install angular1-typescript-decorators --save
```

### Via bower
```bash
bower install angular1-typescript-decorators --save
```

## Steps to get working on it

Once you've installed the package you are ready to write your first application.

### Link into your web app
```html
<script>
    System.config({
        transpiler: 'typescript',
        map: {
            typescript: 'lib/typescript/lib/typescript.js'
        },
        packages: {
            "lib/angular1-typescript-decorators/dist": {
                defaultExtension: 'js'
            }
            "app": {
                defaultExtension: 'ts'
            }
        }
    });
    System.import('app/Module')
          .then(null, console.error.bind(console));
</script>
```

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

### Create a component
Since Angular2 is coming, Angular1 has implemented a component based infratructing, helping you to migrate to the future version.
Please note that there is not controller implementation according to Angular1 specifications. Otherwise you can develop your component class as the expected controller. 

#### Example
```ts
import { Component } from '../lib/angular1-typescript-decorators/dist/Decorators';

interface IMyComponentScope extends ng.IScope{ }

@Component('myComponent', {
    template: `My Component is loaded <button data-ng-click='$ctrl.click()'>Click me!</button>`
})
export class MyComponent{
    constructor(private $http: ng.IHttpService, 
                private $timeout: ng.ITimeoutService, 
                private $scope: IMyComponentScope ){ }

    click(){
        alert('component  button clicked!')
    }
}
```

### Create a controller
```ts
import { Controller } from '../lib/angular1-typescript-decorators/dist/Decorators';

@Controller()
export class SomeController{
    constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $scope: ng.IScope ){ }
    
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

## using ngRoute    
While using ngRoute, you can configure your routes by two ways : 

### On the module (using ModuleConfig decorator and $routeProvider
```ts
interface IMyControllerScope extends ng.IScope{
    text: string
}

@Controller()
export class MyController{
    constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $scope: IMyControllerScope ){
        this.$scope.text = "Hello world!";        
     }
}

@Module({
    name:'angularDemo',
    element: document,
    dependencies: ['ngRoute'],
    controllers: [MyController],
    config: { strictDi: true }
})
class MyModule {
    @ModuleConfig()
    config($routeProvider: ng.route.IRouteProvider){
        $routeProvider.when('/', {
           controller: 'myController',
           templateUrl: '/templates/home.html' 
        });        
    }
}
``` 

### On the controller itself (using module routeBase and controller path).

```ts
interface IMyControllerScope extends ng.IScope{
    text: string
}

@Controller({
    route: {
        path: '/',
        templateUrl: '/templates/home.html'
    }
})
export class MyController{
    constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $scope: IMyControllerScope ){
        this.$scope.text = "Hello world!";        
     }
}

@Module({
    name:'angularDemo',
    element: document,
    route: '/',
    dependencies: ['ngRoute'],
    controllers: [MyController],
    config: { strictDi: true }
})
class MyModule {
}
``` 

## How to bundle/minify
You can use SystemJS Build Tool to build your modules independently. 
This will generate one file per module with it's own imports and minify it.

### install SystemJS Build Tool
```bash
npm install systemjs-builder --save
```

### Configure your gulp task
```javascript
var systemJs = require('systemjs-builder');

gulp.task('system-js', function () {
    var builder = new systemJs({
        baseURL: '/wwwroot'
    });

    builder.config({
        transpiler: 'typescript',
        map: {
            typescript: 'lib/typescript/lib/typescript.js'
        },
        packages: {
            "lib/angular1-typescript-decorators/dist": {
                defaultExtension: 'js'
            }
            "app": {
                defaultExtension: 'ts'
            }
        }
    });

    builder.buildStatic('content/assets/scripts/app/Module.ts', 'wwwroot/content/dist/scripts/app/Module.min.js', { minify: true, sourceMaps: true, mangle: false});
});
```
Please note that actually when minifying, you must disable mangle in order to keep the original argument names.

### Configure SystemJS
```html
<script type="text/javascript">
    System.config({
        packages: {
            "/lib/angular1-typescript-decorators/dist": {
                defaultExtension: 'js'
            },
            "dist": {
                defaultExtension: 'min.js',
            }
        }
    });
</script>
```

## License

[MIT License](http://ilee.mit-license.org)
