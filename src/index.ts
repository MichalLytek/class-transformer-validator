import { validateOrReject, ValidatorOptions } from "class-validator";
import { plainToClass, ClassTransformOptions } from "class-transformer";

export type ClassType<T> = { 
    new (...args: any[]): T;
}
export type PlainObject = {
    [property: string]: any;
}

export interface TransformValdiationOptions {
    validator?: ValidatorOptions;
    transformer?: ClassTransformOptions;
}

/**
 * Converts JSON string to class (constructor) object.
 * 
 * @param {ClassType<T>} classType The Class to parse and convert JSON to.
 * @return {Promise<T>} Promise of object of given class.
 */
export function transformAndValidate<T extends PlainObject>(classType: ClassType<T>, jsonString: string, options?: TransformValdiationOptions): Promise<T>;
/**
 * Converts plain object to class (constructor) object.
 * 
 * @param {ClassType<T>} classType The Class to convert object to.
 * @return {Promise<T>} Promise of object of given class.
 */
export function transformAndValidate<T extends PlainObject>(classType: ClassType<T>, object: PlainObject, options?: TransformValdiationOptions): Promise<T>;

export function transformAndValidate<T extends PlainObject>(classType: ClassType<T>, objectOrString: PlainObject|string, options?: TransformValdiationOptions): Promise<T> {
    return new Promise((resolve, reject) => {
        let object: Object;
        if (typeof objectOrString === "string") {
            object = JSON.parse(objectOrString);
        } else if (typeof objectOrString === "object") {
            object = objectOrString;
        } else {
            return reject(new Error("Incorrect object param type! Only strings and plain objects are valid."));
        }

        const classObject = plainToClass(classType, object, options ? options.transformer : undefined);
        validateOrReject(classObject, options ? options.validator : undefined)
            .then(() => resolve(classObject))
            .catch(reject);
    });
}
