import { awsArgs } from "../types/awsArgs";
const commandLineArgs = require('command-line-args');

export function parseArgs(): awsArgs {
    const options = [
        {name: "source", alias: "s", type: String},
        {name: "dest", alias: "d", type: String},
        {name: "aws_access", type: String},
        {name: "aws_secret",  type: String},
        {name: "region", alias: "r", type: String}
    ];

    return commandLineArgs(options) as awsArgs;
}