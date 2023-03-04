let AWS = require("aws-sdk");
let lambda = new AWS.Lambda();

exports.handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    let playerMove = event.move;
    let playerId = event.userid;

    //TODO validate params here

    let payload = {
        "move" : playerMove,
        "userid" : playerId
    };
    let result = await lambda.invoke(
        {
            FunctionName: "custom-lambda-zork-dev-test",
            Payload: JSON.stringify(payload)
        }
    ).promise();
    
    console.log("response: " + JSON.stringify(result));

    return {
        "result" : result.Payload.result
    }
  }