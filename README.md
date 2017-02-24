# class-transformer-validator

A simple plugin for [class-transformer](https://github.com/pleerock/class-transformer) and [class-validator](https://github.com/pleerock/class-validator) which combines them in a nice and programmer-friendly API.

## Installation

#### Module installation

`npm install class-transformer-validator --save`

#### Peer dependencies

This package is only a simple plugin/wrapper, so you have to install the required modules too because it can't work without them. See detailed installation instruction for the modules installation:

- [class-transformer](https://github.com/pleerock/class-transformer#installation)
- [class-validator](https://github.com/pleerock/class-validator#installation)

## Usage

The usage of this module is very simple.

```typescript
import { IsEmail } from 'class-validator';
import { transformAndValidate } from "class-transformer-validator";

// declare the class using class-validator decorators
class User {
    @IsEmail()
    public email: string;

    public hello(): string {
        return "World!";
    }
}

// then load the JSON string from any part of your app
 const userJson: string = loadJsonFromSomething();

// transform the JSON to class instance and validate it correctness
transformAndValidate(User, userJson)
    .then((userObject: User) => {
        // now you can access all your class prototype method
        console.log(`Hello ${userObject.hello()}`); // prints "Hello World!" on console
    })
    .catch(error => {
        // here you can handle error on transformation (invalid JSON)
        // or validation error (e.g. invalid email property)
        console.err(error);
    });
```
You can also transform and validate plain JS object (e.g. from express req.body). Using ES7 async/await syntax:
```typescript
async (req, res) => {
    try {
        // transform and validate request body
        const userObject = await transformAndValidate(User, req.body);
        // intered type of userObject is User, you can access all class prototype properties and methods
    } catch (error) {
        // your error handling
        console.err(error);
    }
}
```

## API reference

#### Function signatures

There is available one function with two overloads:
```typescript
function transformAndValidate<T extends object>(classType: ClassType<T>, jsonString: string, options?: TransformValdiationOptions): Promise<T>;
```

```typescript
function transformAndValidate<T extends object>(classType: ClassType<T>, object: object, options?: TransformValdiationOptions): Promise<T>;
```

#### Parameters and types

- `classType` - an class symbol, a constructor function which can be called with `new`
```typescript
type ClassType<T> = { 
    new (...args: any[]): T;
}
```
- `jsonString` - a normal string containing JSON

- `object` - plain JS object of type `object` (introduced in TypeScript 2.1), you will have compile-time error while trying to pass number, boolean, null or undefined but unfortunately run-time error when passing a function or an array

- `options` - optional options object, it has two optional properties
```typescript
interface TransformValdiationOptions {
    validator?: ValidatorOptions;
    transformer?: ClassTransformOptions;
}
```
You can use it to pass options for `class-validator` ([more info](https://github.com/pleerock/class-validator/blob/master/src/validation/ValidatorOptions.ts)) and for `class-transformer` ([more info](https://github.com/pleerock/class-transformer/blob/master/src/ClassTransformOptions.ts)).

## More info

The [class-transformer](https://github.com/pleerock/class-transformer) and [class-validator](https://github.com/pleerock/class-validator) are more powerfull than it was showed in the simple usage sample, so go to their github page and check out they capabilities!

## Release notes

**0.2.0**

* changed object parameter type declaration to `object` (introduced in TS 2.2)
* throwing error when passed array, undefined or null

**0.1.1**

* changed throwing error (rejecting promise) [from string to `Error` with message](https://github.com/19majkel94/class-transformer-validator/commit/e0ed33f9f8feb58d52bfdbc78f8150cdfd0ebe77#diff-f41e9d04a45c83f3b6f6e630f10117feR39)

**0.1.0**

* initial version with `transformAndValidate` function
