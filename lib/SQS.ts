import { AWSArgs } from "../types/awsArgs";
import { SQSConfig } from "../types/sqsConfig";
import AWS = require("aws-sdk");

export function getSQS(args: AWSArgs): AWS.SQS {
    const region = args.region ? args.region : "us-east-1";
    const access = args.aws_access ? args.aws_access : null;
    const secret = args.aws_secret ? args.aws_secret : null;

    const config: SQSConfig = {
        apiVersion: "2012-11-05",
        region
    };

    if (access) {
        config.accessKeyId = access;
    }

    if (secret) {
        config.secretAccessKey = secret;
    }

    return new AWS.SQS(config);

}
