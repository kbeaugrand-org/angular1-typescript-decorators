import { Module, ModuleConfig } from '../bower_components/angular1-typescript-decorators/dist/Decorators';
import { MyController } from './Controllers/MyController'
import { MyDirective } from './Directives/MyDirective';

@Module({
    name:'angularDemo',
    element: document,
    route: '/',
    dependencies: ['ngRoute'],
    controllers: [MyController],
    directives: [MyDirective],
    config: { strictDi: true }
})
class MyModule {
    @ModuleConfig()
    config($routeProvider: ng.route.IRouteProvider){

    }
}