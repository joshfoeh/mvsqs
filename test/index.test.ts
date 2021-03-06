import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import { AWSArgs } from "../types/awsArgs";
import { start } from "../lib/index";

describe("Index", () => {

    const expect = chai.expect;
    chai.use(sinonChai);
    chai.should();

    let cli;
    let validate;
    let move;

    const numCompleted = 42;

    const args: AWSArgs = {
        source: "src",
        dest: "dest"
    };

    beforeEach(() => {
        cli = sinon.stub().returns(args);
        validate = sinon.stub().returns(true);
        move = sinon.stub().returns(Promise.resolve(numCompleted));

        sinon.spy(console, "log");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Validate called with correct arguments", () => {
        // Execution
        start({cli, validate, move});

        // Validation
        expect(validate).calledWith(args);
    });

    it("Move called with correct arguments", () => {
        // Execution
        start({cli, validate, move});

        // Validation
        expect(move).calledWith(args);
    });

    it("Process exits when validation fails", () => {
        // Setup
        validate.returns(false);

        sinon.stub(process, "exit");

        // Execution
        start({cli, validate, move});

        // Validation
        expect(process.exit).to.be.calledOnce;
    });

    it("Logs when move succeeds", () => {
        // Execution
        start({cli, validate, move});

        // Validation
        expect(console.log).to.have.been.called;
    });

    it("Logs when move fails", () => {
        // Setup
        move.returns(Promise.reject(numCompleted));

        // Execution
        start({cli, validate, move});

        // Validation
        expect(console.log).to.have.been.called;
    });

});
