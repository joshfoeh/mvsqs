import { getSQS } from "./SQS";
import { sendMessage } from "./sendMessages";
import { receiveMessages } from "./receiveMessages";
import { awsArgs } from "../types/awsArgs";
import { ReceivedMessage } from "../types/receivedMessage";
import { transformMessages, TransformObject } from "./transformMessage";
import { SendingMessage } from "../types/sendingMessage";
import { deleteMessage } from "./deleteMessage";

export function moveMessages(args: awsArgs, {getSqs = getSQS, receive = receiveMessages,
    send = sendMessage, transform = transformMessages} = {}): Promise<number> {

    let sqs = getSqs(args);

    let receiveRun = receive(sqs, args.source);
    let sendRun = send(sqs, args.dest);
    let deleteRun = deleteMessage(sqs, args.source);

    let numMessages = 0;

    return new Promise((resolve, reject) => {
        const moveFunc = (receivedMessage: ReceivedMessage) => {
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
                return reject(numMessages);
            });
        };
        //Kick off the initial message retrieval
        receiveRun().then(moveFunc).catch(() => {
            reject(numMessages);
        });
    });


}