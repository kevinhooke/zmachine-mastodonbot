let AWS = require("aws-sdk");
let lambda = new AWS.Lambda();

exports.handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    
    let payload = {
        "move" : "N",
        "userid" : "kevinhoooke"
    };
    console.log("here1");
    console.log("here2");

    let result = await lambda.invoke(
        {
            FunctionName: "custom-lambda-zork-dev-test",
            Payload: JSON.stringify(payload)
        }
    ).promise();
    
    console.log("here3");
    console.log("response: " + JSON.stringify(result));

    return {
        "result" : result
    }
  }