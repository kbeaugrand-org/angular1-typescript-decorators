import { Module } from '../dist/Decorators'

@Module({
    element: document,
    config: { strictDi: true },
    
})
class MyModule {}