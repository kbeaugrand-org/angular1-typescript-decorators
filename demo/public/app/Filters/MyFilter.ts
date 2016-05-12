import { Filter, FilterFn } from '../../bower_components/angular1-typescript-decorators/dist/Decorators';

@Filter('myFilter')
export class MyFilter{
    
   constructor(private filterValue: number){ }
   
   @FilterFn()
   filter(input){
       return `${input} ${ this.filterValue }`;
   }
}