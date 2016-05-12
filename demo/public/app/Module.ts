import { Module, ModuleConfig, ModuleValue } from '../bower_components/angular1-typescript-decorators/dist/Decorators';
import { MyController } from './Controllers/MyController'
import { MyDirective } from './Directives/MyDirective';
import { MyFilter } from './Filters/MyFilter';

@Module({
    name:'angularDemo',
    element: document,
    route: '/',
    dependencies: ['ngRoute'],
    controllers: [MyController],
    directives: [MyDirective],
    filters: [MyFilter],
    config: { strictDi: true }
})
@ModuleValue('filterValue', 10)
class MyModule {
    @ModuleConfig()
    config($routeProvider: ng.route.IRouteProvider){

    }
}