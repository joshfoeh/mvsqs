export function receiveMessages(getSQS, url: string) {
    let sqs = getSQS();
    let params = {
        QueueUrl: url,
        AttributeNames: [
            "QueueArn"
        ]
    };
    sqs.getQueueAttributes(params, function(err, data) {
        console.log("In receive messages callback");
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}