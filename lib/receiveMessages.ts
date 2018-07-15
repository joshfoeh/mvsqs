import { ReceivedMessage } from "../types/receivedMessage";

export function receiveMessages(sqs, url: string): () => Promise<ReceivedMessage> {
    let params = {
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
        return new Promise<ReceivedMessage>((resolve, reject) => {
            sqs.receiveMessage(params, function (err, data) {
                if (err) {
                    console.log("Error receiving messages");
                    console.log(err, err.stack);
                    return reject();
                }
                let messages = data.Messages;
                if (!messages) {
                    console.log("No messages left in the queue");
                    return resolve(null);
                }
                console.log("Received the message successfully");

                console.log(`Message is: ${JSON.stringify(messages, null, 2)}`);

                return resolve(messages[0] as ReceivedMessage);
            });
        });
    }
}