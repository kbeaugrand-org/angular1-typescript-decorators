import { Controller } from '../../bower_components/angular1-typescript-decorators/dist/Decorators';

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