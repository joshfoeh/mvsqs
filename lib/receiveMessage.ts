import AWS = require("aws-sdk");

export function receiveMessage(sqs: AWS.SQS, url: string): () => Promise<AWS.SQS.Message> {
    const params: AWS.SQS.Types.ReceiveMessageRequest = {
        QueueUrl: url,
        AttributeNames: [
            "All"
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
            "All"
        ],
        VisibilityTimeout: 10,
        WaitTimeSeconds: 10
    };
    return () => {
        return new Promise<AWS.SQS.Message>((resolve, reject) => {
            sqs.receiveMessage(params, (err, data: AWS.SQS.ReceiveMessageResult) => {
                if (err) {
                    console.log("Error receiving messages");
                    console.log(err, err.stack);
                    return reject();
                }
                if (!data.Messages || data.Messages.length === 0) {
                    return resolve(null);
                }
                // It will always be message 0 because we only receive one message at a time
                const message: AWS.SQS.Message = data.Messages[0];
                return resolve(message);
            });
        });
    };
}
