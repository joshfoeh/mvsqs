import AWS = require("aws-sdk");

export function deleteMessage(sqs: AWS.SQS, url: string): (deleteHandle: string) => Promise<boolean> {
    return (deleteHandle: string) => {
        let params: AWS.SQS.DeleteMessageRequest = {
            QueueUrl: url,
            ReceiptHandle: deleteHandle
        };
        return new Promise<boolean>((resolve, reject) => {
            sqs.deleteMessage(params, function (err, data) {
                if (err) {
                    console.log("Error deleting message");
                    console.log(err, err.stack);
                    return reject();
                }
                return resolve(true);
            });
        });
    }

}