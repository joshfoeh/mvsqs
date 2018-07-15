import { SendingMessage } from "../types/sendingMessage";

export function sendMessage(sqs, url: string): (message: SendingMessage) => Promise<boolean> {
    return (message: SendingMessage) => {
        let params = {
            QueueUrl: url,
            ...message
        };
        return new Promise<boolean>((resolve, reject) => {
            // sqs.sendMessage(params, function(err, data) {
            //     if (err) {
            //         console.log("Error sending messages");
            //         console.log(err, err.stack);
            //         return reject();
            //     }
            //     return resolve(true);
            // });
            return resolve(true);
        });
    }

}