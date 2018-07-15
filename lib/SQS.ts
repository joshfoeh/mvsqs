import { awsArgs } from "../types/awsArgs";
import { SQSConfig } from "../types/sqsConfig";
let AWS = require("aws-sdk");

export function getSQS(args: awsArgs) {
    let region = args.region ? args.region: "us-east-1";
    let access = args.aws_access ? args.aws_access: null;
    let secret = args.aws_secret ? args.aws_secret: null;

    let config: SQSConfig = {
        apiVersion: "2012-11-05",
        region: region
    };

    if (access) {
        config.accessKeyId = access;
    }

    if (secret) {
        config.secretAccessKey = secret;
    }

    return new AWS.SQS(config);

}