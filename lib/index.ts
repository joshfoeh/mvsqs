import { parseArgs } from "./cli";
import { awsArgs } from "../types/awsArgs";
import { validateArgs } from "./validateArgs";
import { moveMessages } from "./moveMessages";

export function start({cli = parseArgs, validate = validateArgs, move = moveMessages} = {}) {
    let args: awsArgs = cli();

    validate(args);

    console.log(`Starting move from ${args.source} to ${args.dest}`);

    move(args).then((numCompleted: number) => {
        console.log(`Finished moving ${numCompleted} messages`);
    }).catch((numCompleted: number) => {
        console.log(`Failed after moving ${numCompleted} messages.
        There should be additional logging above`);
    });

}