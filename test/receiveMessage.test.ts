import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import { receiveMessage } from "../lib/receiveMessage";

describe("Receive Message", () => {

    const expect = chai.expect;
    chai.use(sinonChai);
    chai.should();

    const url = "earl";
    let sqs;
    const message = {
        key: "value"
    };
    const messages = {
        Messages: [
            message
        ]
    };

    let receiveFunc;

    beforeEach(() => {
        sqs = sinon.stub();
        sqs.receiveMessage = () => {};
        sinon.stub(sqs, "receiveMessage");

        receiveFunc = receiveMessage(sqs, url);
    });

    it("Resolves with correct value", () => {
        // Setup
        sqs.receiveMessage.onCall(0).callsArgWith(1, null, messages);

        // Execution
        const retPromise = receiveFunc();

        // Validation
        return retPromise.then((val) => {
            expect(val).to.be.equal(message);
        });
    });

    it("Resolves with null", () => {
        // Setup
        sqs.receiveMessage.onCall(0).callsArgWith(1, null, {});

        // Execution
        const retPromise = receiveFunc();

        // Validation
        return retPromise.then((val) => {
            expect(val).to.be.equal(null);
        });
    });

    it("Rejects when there is an error", () => {
        // Setup
        sqs.receiveMessage.onCall(0).callsArgWith(1, {}, null);

        const error = new Error("err");

        // Execution
        const retPromise = receiveFunc();

        // Validation
        return retPromise.then(() => {
            throw error;
        }).catch((err) => {
            expect(err).to.not.equal(error);
        });
    });

    it("Calls receive with correct params", () => {
        // Setup
        sqs.receiveMessage.onCall(0).callsArgWith(1, null, {});

        const expectedArgs = {
            QueueUrl: url,
            AttributeNames: [
                "All"
            ],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: [
                "All"
            ],
            VisibilityTimeout: 10,
            WaitTimeSeconds: 10
        };

        // Execution
        const retPromise = receiveFunc();

        // Validation
        return retPromise.then(() => {
            expect(sqs.receiveMessage).calledWith(expectedArgs, sinon.match.func);
        });
    });

});
