# Angular1 Typescript decorators

Status: In-Development

Write your Angular1 App with Typescript using Decorators.
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

## Steps to get working on it

After you've installed the package you are ready to write your first application.

### Create a module

```ts
import { Module } from '../lib/angular1-decorators/angular1-decorators';
@Module({
    element: document,
    config: { strictDi: true }
})
class MyModule {}
```

This will create an angular module that will be botstraped in the HTML document.

Remarks : `strictDi: true` will tell to angular to use the strict dependency injection. You don't need to take care about it. The angular1-decorators will configure all your dependencies as required.

## License

[MIT License](http://ilee.mit-license.org)
