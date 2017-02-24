import { validateOrReject, ValidatorOptions } from "class-validator";
import { plainToClass, ClassTransformOptions } from "class-transformer";

export type ClassType<T> = { 
    new (...args: any[]): T;
}

export interface TransformValdiationOptions {
    validator?: ValidatorOptions;
    transformer?: ClassTransformOptions;
}

/**
 * Asynchronously converts JSON string to class (constructor) object
 * 
 * @export
 * @template T 
 * @param {ClassType<T>} classType The Class to parse and convert JSON to
 * @param {string} jsonString The string containing JSON
 * @param {TransformValdiationOptions} [options] Optional options object for class-validator and class-transformer
 * @returns {Promise<T>} Promise of object of given class T
 */
export function transformAndValidate<T extends object>(classType: ClassType<T>, jsonString: string, options?: TransformValdiationOptions): Promise<T>;
/**
 * Asynchronously converts plain object to class (constructor) object
 * 
 * @export
 * @template T 
 * @param {ClassType<T>} classType The Class to convert object to
 * @param {object} object The object to instantiate and validate
 * @param {TransformValdiationOptions} [options] Optional options object for class-validator and class-transformer
 * @returns {Promise<T>} Promise of object of given class T
 */
export function transformAndValidate<T extends object>(classType: ClassType<T>, object: object, options?: TransformValdiationOptions): Promise<T>;

export function transformAndValidate<T extends object>(classType: ClassType<T>, somethingToTransform: object|string, options?: TransformValdiationOptions): Promise<T> {
    return new Promise((resolve, reject) => {
        let object: object;
        if (typeof somethingToTransform === "string") {
            object = JSON.parse(somethingToTransform);
        } else if (typeof somethingToTransform === "object" && somethingToTransform !== null && !Array.isArray(somethingToTransform)) {
            object = somethingToTransform;
        } else {
            return reject(new Error("Incorrect object param type! Only strings and plain objects are valid."));
        }

        const classObject = plainToClass(classType, object, options ? options.transformer : void 0);
        validateOrReject(classObject, options ? options.validator : void 0)
            .then(() => resolve(classObject))
            .catch(reject);
    });
}
