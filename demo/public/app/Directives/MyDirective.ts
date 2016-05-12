import { Directive, DirectiveLinkFn } from '../../bower_components/angular1-typescript-decorators/dist/Decorators';
import { MyDirectiveController } from '../Controllers/MyDirectiveController';

@Directive({
    name: 'myDirective',
    controller: MyDirectiveController,
    controllerAs: 'ctrl',
    scope: {
        text: "="
    },
})
export class MyDirective{
    
    constructor(private $http: ng.IHttpService){ }
   
    @DirectiveLinkFn()
    link(){
        debugger;
    }
    
}