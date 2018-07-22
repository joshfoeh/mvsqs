import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import { validateArgs } from "../lib/validateArgs";
import { AWSArgs } from "../types/awsArgs";

describe("Validate Arguments", () => {

    const expect = chai.expect;
    chai.use(sinonChai);
    chai.should();

    beforeEach(() => {
        sinon.spy(console, "log");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Returns false if missing source", () => {
        // Setup
        const args: AWSArgs = {
            source: null,
            dest: "vegas"
        };

        // Execution
        const retMessage = validateArgs(args);

        // Validation
        expect(retMessage).to.be.false;
        expect(console.log).calledWith("Missing required argument: source");
    });

    it("Returns false if missing destination", () => {
        // Setup
        const args: AWSArgs = {
            source: "new york",
            dest: null
        };

        // Execution
        const retMessage = validateArgs(args);

        // Validation
        expect(retMessage).to.be.false;
        expect(console.log).calledWith("Missing required argument: dest");
    });

    it("Returns true if required parameters present", () => {
        // Setup
        const args: AWSArgs = {
            source: "new york",
            dest: "vegas"
        };

        // Execution
        const retMessage = validateArgs(args);

        // Validation
        expect(retMessage).to.be.true;
    });

});
