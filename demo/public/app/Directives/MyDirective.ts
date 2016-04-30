import { Directive } from '../../bower_components/angular1-typescript-decorators/dist/Decorators';
import { MyDirectiveController } from '../Controllers/MyDirectiveController';

@Directive({
    name: 'myDirective',
    controller: MyDirectiveController,
    controllerAs: 'ctrl',
    scope: {
        text: "="
    },
})
export class MyDirective{}