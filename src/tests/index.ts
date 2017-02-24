import { ValidationError, IsEmail } from 'class-validator';
import { transformAndValidate } from "../index";

import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

class User {
    @IsEmail()
    public email: string;

    public greet(): string {
        return "Greeting";
    }
}

describe("transformAndValidate()", () => {
    let user: User;
    const rejectMessage = "Incorrect object param type! Only strings and plain objects are valid.";

    beforeEach(() => {
        user = {
            email: "test@test.com"
        } as User;
    });

    it("should successfully transform and validate user plain object", async () => {
        const transformedUser = await transformAndValidate(User, user);
        expect(transformedUser).to.exist;
        expect(transformedUser.email).to.equals("test@test.com");
        expect(transformedUser.greet()).to.equals("Greeting");
    });

    it("should successfully transform and validate user JSON", async () => {
        const userJson = JSON.stringify(user);

        const transformedUser = await transformAndValidate(User, userJson);
        expect(transformedUser).to.exist;
        expect(transformedUser.email).to.equals("test@test.com");
        expect(transformedUser.greet()).to.equals("Greeting");
    });

    it("should throw ValidationError array when object property is not passing validation", async () => {
        const user = {
            email: "test@test"
        } as User;

        const error = await expect(transformAndValidate(User, user)).to.be.rejected;
        expect(error).to.have.lengthOf(1);
        expect(error[0]).to.be.instanceOf(ValidationError);
    });

    it("should throw SyntaxError while parsing invalid JSON string", async () => {
        const userJson = JSON.stringify(user) + "error";

        const error = await expect(transformAndValidate(User, userJson)).to.be.rejected;
        expect(error).to.be.instanceOf(SyntaxError);
    });

    it("should throw Error when object parameter is a number", async () => {
        const error: Error = await expect(transformAndValidate(User, 2 as any)).to.be.rejected;
        expect(error).to.exist;
        expect(error.message).to.equals(rejectMessage);
    });

    it("should throw Error when object parameter is a function", async () => {
        const func = () => ({ email: "test@test.com"});

        const error: Error = await expect(transformAndValidate(User, func)).to.be.rejected;
        expect(error).to.exist;
        expect(error.message).to.equals(rejectMessage);
    });

    it("should throw Error when object parameter is an array", async () => {
        const error: Error = await expect(transformAndValidate(User, [])).to.be.rejected;
        expect(error).to.exist;
        expect(error.message).to.equals(rejectMessage);
    });

    it("should throw Error when object parameter is a boolean value", async () => {
        const error: Error = await expect(transformAndValidate(User, true as any)).to.be.rejected;
        expect(error).to.exist;
        expect(error.message).to.equals(rejectMessage);
    });

    it("should throw Error when object parameter is a null", async () => {
        const error: Error = await expect(transformAndValidate(User, null as any)).to.be.rejected;
        expect(error).to.exist;
        expect(error.message).to.equals(rejectMessage);
    });

    it("should throw Error when object parameter is an undefined", async () => {
        const error: Error = await expect(transformAndValidate(User, void 0 as any)).to.be.rejected;
        expect(error).to.exist;
        expect(error.message).to.equals(rejectMessage);
    });
});
