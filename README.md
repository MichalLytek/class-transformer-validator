# class-transformer-validator

[![npm version](https://badge.fury.io/js/class-transformer-validator.svg)](https://badge.fury.io/js/class-transformer-validator)
[![Dependency Status](https://david-dm.org/MichalLytek/class-transformer-validator.svg)](https://david-dm.org/MichalLytek/class-transformer-validator)
[![devDependency Status](https://david-dm.org/MichalLytek/class-transformer-validator/dev-status.svg)](https://david-dm.org/MichalLytek/class-transformer-validator#info=devDependencies)
[![peerDependency Status](https://david-dm.org/MichalLytek/class-transformer-validator/peer-status.svg)](https://david-dm.org/MichalLytek/class-transformer-validator#info=devDependencies)

A simple plugin for [class-transformer](https://github.com/typestack/class-transformer) and [class-validator](https://github.com/typestack/class-validator) which combines them in a nice and programmer-friendly API.

## Installation

#### Module installation

`npm install class-transformer-validator --save`

(or the short way):

`npm i -S class-transformer-validator`

#### Peer dependencies

This package is only a simple plugin/wrapper, so you have to install the required modules too because it can't work without them. See detailed installation instruction for the modules installation:

- [class-transformer](https://github.com/typestack/class-transformer#installation)
- [class-validator](https://github.com/typestack/class-validator#installation)

## Usage

The usage of this module is very simple.

```ts
import { IsEmail } from "class-validator";
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
  .catch(err => {
    // here you can handle error on transformation (invalid JSON)
    // or validation error (e.g. invalid email property)
    console.error(err);
  });
```

You can also transform and validate plain JS object (e.g. from express req.body). Using ES7 async/await syntax:

```ts
async (req, res) => {
  try {
    // transform and validate request body
    const userObject = await transformAndValidate(User, req.body);
    // infered type of userObject is User, you can access all class prototype properties and methods
  } catch (err) {
    // your error handling
    console.error(err);
  }
};
```

And since release `0.3.0` you can also pass array of objects - all of them will be validated using given class validation constraints:

```ts
async (req, res) => {
  try {
    // transform and validate request body - array of User objects
    const userObjects = await transformAndValidate(User, req.body);
    userObjects.forEach(user => console.log(`Hello ${user.hello()}`));
  } catch (err) {
    // your error handling
  }
};
```

## API reference

#### Function signatures

There is available the `transformAndValidate` function with three overloads:

```ts
function transformAndValidate<T extends object>(
  classType: ClassType<T>,
  jsonString: string,
  options?: TransformValidationOptions,
): Promise<T | T[]>;
```

```ts
function transformAndValidate<T extends object>(
  classType: ClassType<T>,
  object: object,
  options?: TransformValidationOptions,
): Promise<T>;
```

```ts
function transformAndValidate<T extends object>(
  classType: ClassType<T>,
  array: object[],
  options?: TransformValidationOptions,
): Promise<T[]>;
```

Be aware that if you validate json string, the return type is a `Promise` of `T` or `T[]` so you need to assert the returned type if you know the shape of json:

```ts
const users = (await transformAndValidate(
  User,
  JSON.stringify([{ email: "test@test.test" }]),
)) as User[];
```

Or you can just check the type in runtime using `Array.isArray` method.

#### Synchronous transformation and validation

If you need sync validation, use `transformAndValidateSync` function instead (available since v0.4.0). It will synchronously return `T` or `T[]`, not a Promise.

#### Parameters and types

- `classType` - an class symbol, a constructor function which can be called with `new`

```ts
type ClassType<T> = {
  new (...args: any[]): T;
};
```

- `jsonString` - a normal string containing JSON

- `object` - plain JS object of type `object` (introduced in TypeScript 2.2), you will have compile-time error while trying to pass number, boolean, null or undefined but unfortunately run-time error when passing a function

- `array` - array of plain JS objects like described above

- `options` - optional options object, it has two optional properties

```ts
interface TransformValidationOptions {
  validator?: ValidatorOptions;
  transformer?: ClassTransformOptions;
}
```

You can use it to pass options for `class-validator` ([more info](https://github.com/pleerock/class-validator/blob/master/src/validation/ValidatorOptions.ts)) and for `class-transformer` ([more info](https://github.com/pleerock/class-transformer/blob/master/src/ClassTransformOptions.ts)).

## More info

The [class-transformer](https://github.com/pleerock/class-transformer) and [class-validator](https://github.com/pleerock/class-validator) are more powerful than it was showed in the simple usage sample, so go to their github page and check out they capabilities!

## Release notes

**0.9.1**

- widen `class-transformer` peer dependency version range to `>=0.2.3`
- updated all dev dependencies

**0.9.0**

- bump `class-validator` peer dependency to version `>=0.12.0`
- updated TypeScript dependency to version `^3.9.5`
- updated all dev dependencies

**0.8.0**

- updated `class-transformer` dependency to version `^0.2.3`
- updated `class-validator` dependency to version `^0.10.1`
- updated TypeScript dependency to version `^3.6.3`
- built code is now emitted as ES2015 (dropped es5 support)
- updated all dev dependencies

**0.7.1**

- updated `class-transformer` dependency to version `^0.2.0`

**0.6.0**

- updated `class-validator` dependency to version `^0.9.1`

**0.5.0**

- remove deprecated `TransformValdiationOptions` interface (typo)
- updated `class-validator` dependency to version `^0.8.1` and `class-transformer` to `^0.1.9`

**0.4.1**

- fix `TransformValdiationOptions` interface name typo (deprecate in favour of `TransformValidationOptions`)

**0.4.0**

- added `transformAndValidateSync` function for synchronous validation
- changed return type for JSON's transform and validation to `Promise` of `T` or `T[]`
- updated `class-validator` dependency to version `^0.7.2` and `class-transformer` to `^0.1.7`

**0.3.0**

- added support for transform and validate array of objects given class
- updated `class-validator` dependency to version `^0.7.1`

**0.2.0**

- changed object parameter type declaration to `object` (introduced in TS 2.2)
- throwing error when passed array, undefined or null

**0.1.1**

- changed throwing error (rejecting promise) [from string to `Error` with message](https://github.com/MichalLytek/class-transformer-validator/commit/e0ed33f9f8feb58d52bfdbc78f8150cdfd0ebe77#diff-f41e9d04a45c83f3b6f6e630f10117feR39)

**0.1.0**

- initial version with `transformAndValidate` function
