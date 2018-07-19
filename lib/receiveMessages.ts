import { ReceivedMessage } from "../types/receivedMessage";
import AWS = require("aws-sdk");

export function receiveMessages(sqs: AWS.SQS, url: string): () => Promise<AWS.SQS.Message> {
    const waitSecs: number = 10;
    const millis = waitSecs * 1000;
    let params: AWS.SQS.Types.ReceiveMessageRequest = {
        QueueUrl: url,
        AttributeNames: [
            "All"
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
            "All"
        ],
        VisibilityTimeout: 10,
        WaitTimeSeconds: waitSecs
    };
    return () => {
        return new Promise<AWS.SQS.Message>((resolve, reject) => {
            let timer = setTimeout(() => {
                console.log(`Waited for ${waitSecs} seconds and found no messages, ending process`);
                return resolve(null);
            }, millis);
            sqs.receiveMessage(params, function (err, data: AWS.SQS.ReceiveMessageResult) {
                if (err) {
                    console.log("Error receiving messages");
                    console.log(err, err.stack);
                    return reject();
                }
                if (!data.Messages || data.Messages.length === 0) {
                    // todo why is this the last thing logged?
                    return resolve(null);
                }
                // Still receiving messages, no need to have the timeout run anymore
                clearTimeout(timer);
                // It will always be message 0 because we only receive one message at a time
                let message: AWS.SQS.Message = data.Messages[0];
                return resolve(message);
            });
        });
    }
}