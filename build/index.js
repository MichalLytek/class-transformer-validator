"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_light_1 = require("@servrox/class-validator-light");
const class_transformer_1 = require("class-transformer");
function transformAndValidate(classType, somethingToTransform, options) {
    return new Promise((resolve, reject) => {
        let object;
        if (typeof somethingToTransform === "string") {
            object = JSON.parse(somethingToTransform);
        }
        else if (somethingToTransform != null &&
            typeof somethingToTransform === "object") {
            object = somethingToTransform;
        }
        else {
            return reject(new Error("Incorrect object param type! Only string, plain object and array of plain objects are valid."));
        }
        const classObject = class_transformer_1.plainToClass(classType, object, options ? options.transformer : void 0);
        if (Array.isArray(classObject)) {
            Promise.all(classObject.map(objectElement => class_validator_light_1.validate(objectElement, options ? options.validator : void 0))).then(errors => errors.every(error => error.length === 0)
                ? resolve(classObject)
                : reject(errors));
        }
        else {
            class_validator_light_1.validateOrReject(classObject, options ? options.validator : void 0)
                .then(() => resolve(classObject))
                .catch(reject);
        }
    });
}
exports.transformAndValidate = transformAndValidate;
function transformAndValidateSync(classType, somethingToTransform, options) {
    let object;
    if (typeof somethingToTransform === "string") {
        object = JSON.parse(somethingToTransform);
    }
    else if (somethingToTransform != null &&
        typeof somethingToTransform === "object") {
        object = somethingToTransform;
    }
    else {
        throw new Error("Incorrect object param type! Only string, plain object and array of plain objects are valid.");
    }
    const classObject = class_transformer_1.plainToClass(classType, object, options ? options.transformer : void 0);
    if (Array.isArray(classObject)) {
        const errorsArray = classObject.map(objectElement => class_validator_light_1.validateSync(objectElement, options ? options.validator : void 0));
        if (errorsArray.some(errors => errors.length !== 0)) {
            throw errorsArray;
        }
        return classObject;
    }
    else {
        const errors = class_validator_light_1.validateSync(classObject, options ? options.validator : void 0);
        if (errors.length) {
            throw errors;
        }
        return classObject;
    }
}
exports.transformAndValidateSync = transformAndValidateSync;
