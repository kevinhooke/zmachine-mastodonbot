let AWS = require("aws-sdk");
let lambda = new AWS.Lambda();

const GAME_TEXT_INTRO = "ZORK I: The Great Underground Empire\nInfocom interactive fiction - a fantasy story\nCopyright (c) 1981, 1982, 1983, 1984, 1985, 1986 Infocom, Inc. All rights\nreserved.\nZORK is a registered trademark of Infocom, Inc.\nRelease 119 / Serial number 880429";
const GAME_TEXT_INTRO_NEW_GAME = "West of House                               Score: 0        Moves: 0\n\nZORK I: The Great Underground Empire\nInfocom interactive fiction - a fantasy story\nCopyright (c) 1981-1986 Infocom, Inc. All rights\nreserved.\nZORK is a registered trademark of Infocom, Inc.\nRelease 119\n\nWest of House\nYou are standing in an open field west of a white house, with a boarded\nfront door.\nThere is a small mailbox here.";

exports.handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    let playerMove = event.move;
    let playerId = event.userid;

    //validate params
    if(playerMove){
        //escape user entered text
        playerMove = encodeURIComponent(playerMove);
    }
    //check for blank or 'play' to start a new game
    if(!playerMove || playerMove === "play"){
        console.log("empty move or 'play' - starting new game");
        playerMove = "look"; //if no command given just 'look' and this will return the results in the correct number of lines for parsing as if you have moved
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
    
    let currentGamePosition = exports.parseGamePositionFromGameEngineResponse(parsedResult);
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
    //TODO test removing this now, handled elsewhere?
    //result = result.replace(/\n/g, "\\n");

    return result;
  }

  exports.parseGamePositionFromGameEngineResponse = (gameText) => {
        //split on entry prompt '>'
        let lines = gameText.split('>');
        let currentGamePosition = "";

        //if game text contains "Moves: 0" (after game is loaded) and "Moves: 0" this is the first
        //game position after loading
        if(gameText.includes("Your score is 0 (total of 350 points), in 1 move")){
            console.log("parseGamePositionFromGameEngineResponse() returning new game text");
            currentGamePosition = GAME_TEXT_INTRO_NEW_GAME;
        }
        else{
            //otherwise, new game position after move is 5 back from the end of the text
            console.log("parseGamePositionFromGameEngineResponse() returning continuing game text")
            currentGamePosition = lines[lines.length - 5];
        }

        return currentGamePosition;
  }