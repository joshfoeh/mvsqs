import AWS = require("aws-sdk");

export function transformMessage(receivedMessage: AWS.SQS.Message): TransformObject {
    const transformedAttributes: AWS.SQS.MessageBodyAttributeMap = transformAttributes(receivedMessage.MessageAttributes);
    const send = {
        MessageBody: receivedMessage.Body,
        MessageAttributes: transformedAttributes
    } as AWS.SQS.SendMessageRequest;
    return {
        sendingMessage: send,
        deleteHandle: receivedMessage.ReceiptHandle
    } as TransformObject;
}

function transformAttributes(attributes: AWS.SQS.MessageBodyAttributeMap): AWS.SQS.MessageBodyAttributeMap {
    const transformed: AWS.SQS.MessageBodyAttributeMap = {};

    for (const key in attributes) {
        if (!key) {
            continue;
        }
        const value: AWS.SQS.MessageAttributeValue = attributes[key];
        // Remove the not yet implemented list values
        transformed[key] = {
            DataType: value.DataType,
            StringValue: value.StringValue,
            BinaryValue: value.BinaryValue
        } as AWS.SQS.MessageAttributeValue;
    }
    return transformed;
}

export interface TransformObject {
    sendingMessage: AWS.SQS.SendMessageRequest;
    deleteHandle: string;
}
