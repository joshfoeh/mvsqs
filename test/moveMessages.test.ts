import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");

describe("Validate Arguments", () => {

    const expect = chai.expect;
    chai.use(sinonChai);
    chai.should();

    sinon.spy(console, "log");

    it("Returns false if missing source", () => {
        // Setup

        // Execution

        // Validation
    });

});
