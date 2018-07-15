import { ReceivedMessage } from "../types/receivedMessage";
import { SendingMessage } from "../types/sendingMessage";

export function transformMessages(receivedMessage: ReceivedMessage): TransformObject {
    const send = <SendingMessage>{

    };
    console.log(`in transform, message is: ${JSON.stringify(receivedMessage, null, 2)}`);
    return <TransformObject>{
        sendingMessage: send,
        deleteHandle: receivedMessage.ReceiptHandle
    };
}

export interface TransformObject{
    sendingMessage: SendingMessage,
    deleteHandle: string
}