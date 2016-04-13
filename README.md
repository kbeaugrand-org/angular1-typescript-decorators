# Angular1 Typescript decorators

Status: In-Development

Write your Angular1 App with Typescript using Decorators
### Example use:

```ts
import { Module } from '../lib/angular1-decorators/angular1-decorators';
import { SomeService } from './Services';
import { SomeDirective } from './Directives';
import { SomeController } from './Controllers'

@Module({
    element: document,
    directives: [SomeDirective],
    services: [SomeService],
    controllers: [ SomeController ],
    config: { strictDi: true }
})
class MyModule {}
```

### Install:
```bash
npm install angular1-typescript-decorators --save
```
