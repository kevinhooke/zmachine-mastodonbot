let AWS = require("aws-sdk");
let lambda = new AWS.Lambda();

exports.handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    let playerMove = event.move;
    let playerId = event.userid;

    //TODO validate params here
    if(!event.move){
        event.move = "look"; //if no command given just 'lool' and this will return the results in the correct number of lines for parsing as if you have moved
    }
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
    
    console.log("lambda result: " + JSON.stringify(result));
    let resultPayload = result.Payload;

    console.log("resultPayload: " + resultPayload);
    let parsedResult = resultPayload.replace("ZORK I: The Great Underground Empire\nInfocom interactive fiction - a fantasy story\nCopyright (c) 1981, 1982, 1983, 1984, 1985, 1986 Infocom, Inc. All rights\nreserved.\nZORK is a registered trademark of Infocom, Inc.\nRelease 119 / Serial number 880429", "");
    // let introPattern = /.*>/i
    // parsedResult = parsedResult.replace(introPattern, "");

    // //let currentLocationPattern = /.*\\n\\n\\n\\n.*\\n\\n/i
    // let currentLocationPattern = /.*Moves: \d\n\n\n\n/i
    // parsedResult = parsedResult.replace(currentLocationPattern, "");

    // let currentLocationPattern2 = /.*\n\n/i
    // parsedResult = parsedResult.replace(currentLocationPattern2, "");

    // let currentLocationPattern3 = /.*Moves: \d\n\n/i
    // parsedResult = parsedResult.replace(currentLocationPattern3, "");

    //split on entry prompt '>'
    let lines = parsedResult.split('>');

    // lines.forEach(element => {
    //     console.log("line: >" + element);
    // });

    //prompt 0 text = game intro before save game is loaded
    //prompt 1 text = text after game is loaded
    //let currentGamePosition = lines[1];

    //latest game position is 4 back from the end of the text
    //TODO this doesn't work for first game start
    let currentGamePosition = lines[lines.length - 5];
    console.log("parsedResult: " + currentGamePosition);

    return {
        "result" : currentGamePosition
    }
  }