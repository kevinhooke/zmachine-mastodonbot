let AWS = require("aws-sdk");
let lambda = new AWS.Lambda();

const GAME_TEXT_INTRO = "ZORK I: The Great Underground Empire\nInfocom interactive fiction - a fantasy story\nCopyright (c) 1981, 1982, 1983, 1984, 1985, 1986 Infocom, Inc. All rights\nreserved.\nZORK is a registered trademark of Infocom, Inc.\nRelease 119 / Serial number 880429";

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
    let parsedResult = exports.parsePayload(resultPayload);
    console.log("parsedResult: " + parsedResult);
    
    //split on entry prompt '>'
    let lines = parsedResult.split('>');

    //prompt 0 text = game intro before save game is loaded
    //prompt 1 text = text after game is loaded
    //let currentGamePosition = lines[1];

    //latest game position is 4 back from the end of the text
    //TODO this doesn't work for first game start
    let currentGamePosition = lines[lines.length - 5];
    console.log("currentGamePosition: " + currentGamePosition);

    return {
        "result" : currentGamePosition
    }
  }

  exports.parsePayload = (payload) => {
    let result = payload;
    
    //strip intro text
    result = result.replace(GAME_TEXT_INTRO, "");
    
    //replace literal \n with escaped \\n
    result = result.replace(/\n/g, "\\n");

    return result;
  }