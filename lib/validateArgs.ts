import { AWSArgs } from "../types/awsArgs";

export function validateArgs(args: AWSArgs): boolean {
    let missingParam: string;
    if (!args.source) {
        missingParam = "source";
    } else if (!args.dest) {
        missingParam = "dest";
    }
    if (missingParam) {
        console.log(`Missing required argument: ${missingParam}`);
        return false;
    }
    return true;
}
