#mvsqs
Mvsqs is a global package that transfers all messages from one SQS queue to another. 
This could be useful in situations where you need to transfer messages from a DLQ or you are retiring a queue.

##Install
```
npm i -g sqsmv
```
##Usage
Required arguments are:
 
    -s --source (queue to move messages from)

    -d --destination (queue where messages should end up)

Optionally you can provide:

    -r --region (defaults to us-east-1)

    --aws_access 

    --aws_secret (aws will go through the typical credential chain if these aren't provided)
    
###Example
Basic example

    sqsmv -s sourceUrl -d destUrl
    

Full Example

    sqsmv --source=sourceUrl --dest=destUrl --region=us-west-1 --aws_access=XXXXXX --aws_secret=YYYYYY
    
    
###Built With
[aws-sdk](https://www.npmjs.com/package/aws-sdk)

[command-line-args](https://www.npmjs.com/package/command-line-args)

 
