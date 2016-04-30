import { Controller, Log } from '../../bower_components/angular1-typescript-decorators/dist/Decorators';

interface IDirectiveScope extends ng.IScope
{
    text: string;
}

@Controller()
export class MyDirectiveController{
    text: string;
    
    constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $scope: IDirectiveScope ){  
        this.text = $scope.text;
    }
    
    @Log()
    clickAction(){
        console.log("Button clicked!");
    }
}