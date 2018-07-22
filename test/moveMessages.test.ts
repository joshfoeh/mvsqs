import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import { AWSArgs } from "../types/awsArgs";
import { moveMessages } from "../lib/moveMessages";

describe("Validate Move Messages", () => {

    const expect = chai.expect;
    chai.use(sinonChai);
    chai.should();

    const args: AWSArgs = {
        source: "src",
        dest: "dst"
    };

    let sqs;
    let getSQS;

    let receive;
    let receiveMessage;

    let send;
    let sendMessage;

    let transform;

    let deleteFunc;
    let deleteMessage;

    beforeEach(() => {
        // Setup sqs
        sqs = sinon.stub();
        getSQS = sinon.stub().returns(sqs);

        // Setup receive
        receive = sinon.stub().returns(Promise.resolve({}));
        receiveMessage = sinon.stub().returns(receive);

        // Setup send
        send = sinon.stub().returns(Promise.resolve(true));
        sendMessage = sinon.stub().returns(send);

        // Setup delete
        deleteFunc = sinon.stub().returns(Promise.resolve(true));
        deleteMessage = sinon.stub().returns(deleteFunc);

        // Setup transform
        const transformObj = {
            sendingMessage: {},
            deleteHandle: ""
        };
        transform = sinon.stub().returns(transformObj);

        sinon.spy(console, "log");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Resolves after processing 3 messages", () => {
        // Setup receive
        const message1 = {
            message: "one"
        };
        receive.onCall(0).returns(Promise.resolve(message1));
        const message2 = {
            message: "two"
        };
        receive.onCall(1).returns(Promise.resolve(message2));
        const message3 = {
            message: "three"
        };
        receive.onCall(2).returns(Promise.resolve(message3));
        receive.onCall(3).returns(Promise.resolve(null));

        // Setup transform
        const transform1 = {
            sendingMessage: {
                message: "one"
            },
            deleteHandle: "delete1"
        };
        transform.onCall(0).returns(transform1);
        const transform2 = {
            sendingMessage: {
                message: "two"
            },
            deleteHandle: "delete2"
        };
        transform.onCall(1).returns(transform2);
        const transform3 = {
            sendingMessage: {
                message: "three"
            },
            deleteHandle: "delete3"
        };
        transform.onCall(2).returns(transform3);

        // Execution
        const retPromise = moveMessages(args, {getSqs: getSQS, receive: receiveMessage, send: sendMessage,
            transform, deleteFunc: deleteMessage});

        // Validation
        return retPromise.then((value: number) => {
            expect(value).to.equal(3);

            // Validate transform calls
            expect(transform.firstCall).calledWith(message1);
            expect(transform.secondCall).calledWith(message2);
            expect(transform.thirdCall).calledWith(message3);

            // Validate send calls
            expect(send.firstCall).calledWith(transform1.sendingMessage);
            expect(send.secondCall).calledWith(transform2.sendingMessage);
            expect(send.thirdCall).calledWith(transform3.sendingMessage);

            // Validate delete calls
            expect(deleteFunc.firstCall).calledWith(transform1.deleteHandle);
            expect(deleteFunc.secondCall).calledWith(transform2.deleteHandle);
            expect(deleteFunc.thirdCall).calledWith(transform3.deleteHandle);
        });
    });

    it("Calls functions with correct arguments", () => {
        // Setup
        receive.returns(Promise.resolve(null));

        // Execution
        const retPromise = moveMessages(args, {getSqs: getSQS, receive: receiveMessage, send: sendMessage,
            transform, deleteFunc: deleteMessage});

        // Validate
        expect(getSQS).calledWith(args);
        expect(receiveMessage).calledWith(sqs, args.source);
        expect(sendMessage).calledWith(sqs, args.dest);
        expect(deleteMessage).calledWith(sqs, args.source);

        return retPromise.then((value: number) => {
            expect(value).to.equal(0);
        });
    });

    it("Rejects when first receive fails", () => {
        // Setup
        receive.returns(Promise.reject());

        const error = new Error("thing");

        // Execution
        const retPromise = moveMessages(args, {getSqs: getSQS, receive: receiveMessage, send: sendMessage,
            transform, deleteFunc: deleteMessage});

        // Validate
        return retPromise.then(() => {
            throw error;
        }).catch((value) => {
            if (value === error) {
                sinon.assert.fail("Then should not have been called");
                return;
            }
            expect(value).to.equal(0);
            expect(receive.calledOnce).to.be.true;
            expect(transform.notCalled).to.be.true;
            expect(send.notCalled).to.be.true;
            expect(deleteFunc.notCalled).to.be.true;
        });
    });

    it("Rejects when second delete fails", () => {
        // Setup
        deleteFunc.onSecondCall().returns(Promise.reject());

        const error = new Error("thing");

        // Execution
        const retPromise = moveMessages(args, {getSqs: getSQS, receive: receiveMessage, send: sendMessage,
            transform, deleteFunc: deleteMessage});

        // Validate
        return retPromise.then(() => {
            throw error;
        }).catch((value) => {
            if (value === error) {
                sinon.assert.fail("Then should not have been called");
                return;
            }
            expect(value).to.equal(1);
            expect(receive.calledTwice).to.be.true;
            expect(transform.calledTwice).to.be.true;
            expect(send.calledTwice).to.be.true;
            expect(deleteFunc.calledTwice).to.be.true;
            expect(console.log).calledWith("Failed to delete message");
        });
    });

    it("Rejects when second send fails", () => {
        // Setup
        send.onSecondCall().returns(Promise.reject());

        const error = new Error("thing");

        // Execution
        const retPromise = moveMessages(args, {getSqs: getSQS, receive: receiveMessage, send: sendMessage,
            transform, deleteFunc: deleteMessage});

        // Validate
        return retPromise.then(() => {
            throw error;
        }).catch((value) => {
            if (value === error) {
                sinon.assert.fail("Then should not have been called");
                return;
            }
            expect(value).to.equal(1);
            expect(receive.calledTwice).to.be.true;
            expect(transform.calledTwice).to.be.true;
            expect(send.calledTwice).to.be.true;
            expect(deleteFunc.calledOnce).to.be.true;
            expect(console.log).calledWith("Failed to send message");
        });
    });

});
