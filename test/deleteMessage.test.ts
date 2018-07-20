import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import { deleteMessage } from "../lib/deleteMessage";

describe("Delete Message", () => {

    const expect = chai.expect;
    chai.use(sinonChai);
    chai.should();

    const url = "earl";
    let sqs;
    const deleteHandle = "delete";

    let deleteFunc;

    beforeEach(() => {
        sqs = sinon.stub();
        sqs.deleteMessage = () => {};
        sinon.stub(sqs, "deleteMessage");

        deleteFunc = deleteMessage(sqs, url);
    });

    it("Resolves with correct value", () => {
        // Setup
        sqs.deleteMessage.onCall(0).callsArgWith(1, null, {});

        // Execution
        const retPromise = deleteFunc(deleteHandle);

        // Validation
        return retPromise.then((val: boolean) => {
            expect(val).to.be.true;
        });
    });

    it("Rejects when there is an error", () => {
        // Setup
        sqs.deleteMessage.onCall(0).callsArgWith(1, {}, null);

        const error = new Error("err");

        // Execution
        const retPromise = deleteFunc(deleteHandle);

        // Validation
        return retPromise.then(() => {
            throw error;
        }).catch((err) => {
            expect(err).to.not.equal(error);
        });
    });

    it("Calls delete with correct params", () => {
        // Setup
        const expected = {
            QueueUrl: url,
            ReceiptHandle: deleteHandle
        };

        sqs.deleteMessage.onCall(0).callsArgWith(1, null, null);

        // Execution
        const retPromise = deleteFunc(deleteHandle);

        // Validation
        return retPromise.then(() => {
            sqs.deleteMessage.should.have.been.calledOnce;
            expect(sqs.deleteMessage).calledWith(expected, sinon.match.any);
        });
    });

});
