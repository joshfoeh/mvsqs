import { SendingMessage } from "../types/sendingMessage";
import AWS = require("aws-sdk");

export function sendMessage(sqs: AWS.SQS, url: string): (message: AWS.SQS.SendMessageRequest) => Promise<boolean> {
    return (message: AWS.SQS.SendMessageRequest) => {
        let params: AWS.SQS.Types.SendMessageRequest = {
            QueueUrl: url,
            ...message
        };
        return new Promise<boolean>((resolve, reject) => {
            sqs.sendMessage(params, function(err, data: AWS.SQS.Types.SendMessageResult) {
                if (err) {
                    console.log("Error sending message");
                    console.log(err, err.stack);
                    return reject();
                }
                return resolve(true);
            });
        });
    }

}