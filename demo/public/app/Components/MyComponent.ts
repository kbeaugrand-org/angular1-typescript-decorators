import { Component } from '../../bower_components/angular1-typescript-decorators/dist/Decorators';

interface IMyComponentScope extends ng.IScope{

}

@Component('myComponent', {
    template: `My Component is loaded`
})
export class MyComponent{
    constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $scope: IMyComponentScope ){

    }
}