import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import { sendMessage } from "../lib/sendMessage";

describe("Send Message", () => {

    const expect = chai.expect;
    chai.use(sinonChai);
    chai.should();

    const url = "earl";
    let sqs;
    const message = {
        key: "value",
        otherKey: "lameValue"
    };

    let sendFunc;

    beforeEach(() => {
        sqs = sinon.stub();
        sqs.sendMessage = () => {};
        sinon.stub(sqs, "sendMessage");

        sendFunc = sendMessage(sqs, url);
    });

    it("Resolves with correct value", () => {
        // Setup
        sqs.sendMessage.onCall(0).callsArgWith(1, null, {});

        // Execution
        const retPromise = sendFunc(message);

        // Validation
        return retPromise.then((val) => {
            expect(val).to.be.true;
        });
    });

    it("Rejects when there is an error", () => {
        // Setup
        sqs.sendMessage.onCall(0).callsArgWith(1, {}, null);

        const error = new Error("err");

        // Execution
        const retPromise = sendFunc(message);

        // Validation
        return retPromise.then(() => {
            throw error;
        }).catch((err) => {
            expect(err).to.not.equal(error);
        });
    });

    it("Calls send with correct params", () => {
        // Setup
        sqs.sendMessage.onCall(0).callsArgWith(1, null, {});

        const expectedArgs = {
            QueueUrl: url,
            ...message
        };

        // Execution
        const retPromise = sendFunc(message);

        // Validation
        return retPromise.then(() => {
            expect(sqs.sendMessage).calledWith(expectedArgs, sinon.match.func);
        });
    });

});
