import { getSQS } from "./SQS";
import { sendMessage } from "./sendMessage";
import { receiveMessage } from "./receiveMessage";
import { AWSArgs } from "../types/awsArgs";
import { transformMessage, TransformObject } from "./transformMessage";
import { deleteMessage } from "./deleteMessage";
import AWS = require("aws-sdk");

export function moveMessages(args: AWSArgs, {getSqs = getSQS, receive = receiveMessage,
    send = sendMessage, transform = transformMessage, deleteFunc = deleteMessage} = {}): Promise<number> {

    const sqs: AWS.SQS = getSqs(args);

    const receiveRun = receive(sqs, args.source);
    const sendRun = send(sqs, args.dest);
    const deleteRun = deleteFunc(sqs, args.source);

    let numMessages = 0;

    return new Promise((resolve, reject) => {
        const moveFunc = (receivedMessage: AWS.SQS.Message) => {
            if (!receivedMessage) {
                // No message was received, we have emptied the queue
                return resolve(numMessages);
            }
            numMessages += 1;

            const transformObject: TransformObject = transform(receivedMessage);
            sendRun(transformObject.sendingMessage).then(() => {
                deleteRun(transformObject.deleteHandle).then(() => {
                    return receiveRun();
                }).catch(() => {
                    console.log("Failed to delete message");
                    return reject(numMessages);
                }).then(moveFunc).catch(() => {
                    return reject(numMessages);
                });
            }).catch(() => {
                console.log("Failed to send message");
                return reject(numMessages);
            });
        };
        //Kick off the initial message retrieval
        receiveRun().then(moveFunc).catch(() => {
            reject(numMessages);
        });
    });

}
