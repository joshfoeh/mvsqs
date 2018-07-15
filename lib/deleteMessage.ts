export function deleteMessage(sqs, url: string): (deleteHandle: string) => Promise<boolean> {
    return (deleteHandle: string) => {
        console.log(`delete handle is: ${deleteHandle}`);
        let params = {
            QueueUrl: url,
            ReceiptHandle: deleteHandle
        };
        console.log(`Delete params are: ${JSON.stringify(params, null, 2)}`);
        return new Promise<boolean>((resolve, reject) => {
            sqs.deleteMessage(params, function (err, data) {
                if (err) {
                    console.log("Error deleting message");
                    console.log(err, err.stack);
                    return reject();
                }
                console.log("Deleted the message successfully");
                return resolve(true);
            });
        });
    }

}