import chai = require("chai");
import { transformMessage } from "../lib/transformMessage";

describe("Transform Message", () => {

    const expect = chai.expect;
    chai.should();

    const handle = "JosefHandel";
    const body = "theBod";

    const key1 = "keyLime";
    const dataType1 = "superType";
    const stringVal = "stringCheese";

    const key2 = "pie";
    const dataType2 = "notAsCoolType";
    const binaryVal = "fortyTwo";

    const received = {
        ReceiptHandle: handle,
        Body: body,
        MessageAttributes: {
            [key1]: {
                DataType: dataType1,
                StringValue: stringVal,
                StringListValues: []
            },
            [key2]: {
                DataType: dataType2,
                BinaryValue: binaryVal,
                BinaryListValues: []
            }
        },
        extra: "shouldntBeHere"
    };

    it("Transforms message into correct value", () => {
        // Setup
        const expectedMessage = {
            Body: body,
            MessageAttributes: {
                [key1]: {
                    DataType: dataType1,
                    StringValue: stringVal
                },
                [key2]: {
                    DataType: dataType2,
                    BinaryValue: binaryVal
                }
            }
        };

        const expected = {
            sendingMessage: expectedMessage,
            deleteHandle: handle
        };

        // Execution
        const retMessage = transformMessage(received);

        // Validation
        expect(retMessage).to.deep.equal(retMessage);
    });

});
