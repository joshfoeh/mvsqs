import { awsArgs } from "../types/awsArgs";

export function validateArgs(args: awsArgs) {
    let missingParam: string;
    if (!args.source) {
        missingParam = "source";
    }
    else if (!args.dest) {
        missingParam = "dest";
    }
    if (missingParam) {
        console.log(`Missing required argument: ${missingParam}`);
        process.exit(1);
    }
}