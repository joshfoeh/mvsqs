import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import { AWSArgs } from "../types/awsArgs";
import { parseArgs } from "../lib/cli";

describe("CLI", () => {

    const expect = chai.expect;
    chai.use(sinonChai);
    chai.should();

    let commandLineArgs;

    const expectedArgs: AWSArgs = {
        source: "src",
        dest: "dst"
    };

    beforeEach(() => {
        commandLineArgs = sinon.stub().returns(expectedArgs);
    });

    it("Calls command line args with the correct object", () => {
        // Setup
        const expected = [
            {name: "source", alias: "s", type: String},
            {name: "dest", alias: "d", type: String},
            {name: "aws_access", type: String},
            {name: "aws_secret",  type: String},
            {name: "region", alias: "r", type: String}
        ];

        // Execution
        parseArgs({cli: commandLineArgs});

        // Validation
        expect(commandLineArgs).calledWith(expected);
    });

    it("Returns the correct object", () => {
        // Execution
        const retArgs: AWSArgs = parseArgs({cli: commandLineArgs});

        // Validation
        expect(retArgs).to.deep.equal(expectedArgs);
    });

});
