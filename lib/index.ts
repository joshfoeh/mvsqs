import { parseArgs } from "./cli";
import { awsArgs } from "../types/awsArgs";
import { validateArgs } from "./validateArgs";
import { moveMessages } from "./moveMessages";

export function start({cli = parseArgs, validate = validateArgs, move = moveMessages} = {}) {
    let args: awsArgs = cli();

    validate(args);

    move({args: args});

}