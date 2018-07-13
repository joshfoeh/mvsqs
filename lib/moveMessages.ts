import { getSQS } from "./SQS";
import { sendMessage } from "./sendMessages";
import { receiveMessages } from "./receiveMessages";

export function moveMessages({args, getSqs = getSQS,
                                 send = sendMessage, receive = receiveMessages}) {
    let sqs = getSqs(args);

    send(sqs, args.dest);

    receive(sqs, args.source);

}