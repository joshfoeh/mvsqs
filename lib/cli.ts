import { AWSArgs } from "../types/awsArgs";
import commandLineArgs = require("command-line-args");

export function parseArgs({cli = commandLineArgs} = {}): AWSArgs {
    const options = [
        {name: "source", alias: "s", type: String},
        {name: "dest", alias: "d", type: String},
        {name: "aws_access", type: String},
        {name: "aws_secret",  type: String},
        {name: "region", alias: "r", type: String}
    ];

    return cli(options) as AWSArgs;
}
