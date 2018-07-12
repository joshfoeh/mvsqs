import { parseArgs } from "./cli";
import { awsArgs } from "../types/awsArgs";

export function start({cli = parseArgs} = {}) {
    let options: awsArgs = cli();

    // Validate args
    let missingParam: string;
    if (!options.source) {
        missingParam = "source";
    }
    else if (!options.dest) {
        missingParam = "dest";
    }
    if (missingParam) {
        console.log(`Missing required argument: ${missingParam}`);
        process.exit(1);
    }

    console.log(`Options are:
    ${JSON.stringify(options, null, 2)}`);

}