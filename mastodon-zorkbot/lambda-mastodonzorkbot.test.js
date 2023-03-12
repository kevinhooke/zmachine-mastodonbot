let mastodonzorkbot = require('./lambda-mastodonzorkbot');


test('parse save game response json string', () => {
    let test = {
        "StatusCode": 200,
        "ExecutedVersion": "$LATEST",
        "Payload": "{\"result\":\"Please enter a filename [zork1.qzl]: Ok.\\n\\n\"}"
    };

    let result = mastodonzorkbot.parseResponse(test);
    console.log(`Result: ${result}`);
    let expectedResponse = {
        result: "Please enter a filename [zork1.qzl]: Ok.\n\n"
    };

    expect(result).toMatchObject(expectedResponse);
});

test('parse mailbox response json string', () => {
    let test = {
        "StatusCode": 200,
        "ExecutedVersion": "$LATEST",
        "Payload": "{\"result\":\" West of House                               Score: 0        Moves: 29\\n\\nOpening the small mailbox reveals a leaflet.\\n\\n\"}"
    }

    let result = mastodonzorkbot.parseResponse(test);
    console.log(`Result: ${result}`);
    let expectedResponse = {
        result: " West of House                               Score: 0        Moves: 29\n\nOpening the small mailbox reveals a leaflet.\n\n"
    };

    expect(result).toMatchObject(expectedResponse);
});