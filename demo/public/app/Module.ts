import { Module, ModuleConfig } from '../bower_components/angular1-typescript-decorators/dist/Decorators';
import { MyController } from './Controllers/MyController'

@Module({
    name:'angularDemo',
    element: document,
    route: '/',
    dependencies: ['ngRoute'],
    controllers: [MyController],
    config: { strictDi: true }
})
class MyModule {
    
    @ModuleConfig()
    config($routeProvider: ng.route.IRouteProvider){

    }
}