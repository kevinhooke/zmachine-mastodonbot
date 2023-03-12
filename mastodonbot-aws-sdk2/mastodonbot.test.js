let mastodonbot = require('./mastodonbot.js');

test('no changes required to input', () => {
    let result = mastodonbot.parsePayload('test');
    console.log(`Result: ${test}`);
    expect(result).toBe('test');
})

test('remove game load header from return text', () => {
    let result = mastodonbot.parsePayload(" West of House                               Score: 0        Moves: 0\n\nZORK I: The Great Underground Empire\nInfocom interactive fiction - a fantasy story\nCopyright (c) 1981, 1982, 1983, 1984, 1985, 1986 Infocom, Inc. All rights\nreserved.\nZORK is a registered trademark of Infocom, Inc.\nRelease 119 / Serial number 880429\n\nWest of House\nYou are standing in an open field west of a white house, with a boarded\nfront door.\nThere is a small mailbox here.\n\n> West of House                               Score: 0        Moves: 1\n\nWest of House\nYou are standing in an open field west of a white house, with a boarded\nfront door.\nThere is a small mailbox here.\n\n>Please enter a filename [zork1.qzl]: Ok.\n\n>There was no verb in that sentence!\n\n>Your score is 0 (total of 350 points), in 1 move.\nThis gives you the rank of Beginner.\nDo you wish to leave the game? (Y is affirmative): >Ok.\n\n>");
    console.log(`Result: ${result}`);
    expect(result).toBe(' West of House                               Score: 0        Moves: 0\\n\\n\\n\\nWest of House\\nYou are standing in an open field west of a white house, with a boarded\\nfront door.\\nThere is a small mailbox here.\\n\\n> West of House                               Score: 0        Moves: 1\\n\\nWest of House\\nYou are standing in an open field west of a white house, with a boarded\\nfront door.\\nThere is a small mailbox here.\\n\\n>Please enter a filename [zork1.qzl]: Ok.\\n\\n>There was no verb in that sentence!\\n\\n>Your score is 0 (total of 350 points), in 1 move.\\nThis gives you the rank of Beginner.\\nDo you wish to leave the game? (Y is affirmative): >Ok.\\n\\n>');
})