import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { fromUtf8 } from  "@aws-sdk/util-utf8-node";

export const handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    
    let client = new LambdaClient();
    let payload = {
        "move" : "N",
        "userid" : "kevinhoooke"
    };
    console.log("here1");
    const command = new InvokeCommand(
        {
            FunctionName: "custom-lambda-zork-dev-test",
            Payload: JSON.stringify(payload)
        }
    );
    console.log("here2");
    const { Payload, LogResult } = await client.send(command);
    console.log("here3");
    const result = Buffer.from(Payload).toString();
    console.log("here4");
    console.log("response: " + JSON.stringify(Payload));

    return {
        "result" : JSON.stringify(Payload)
    }
  }