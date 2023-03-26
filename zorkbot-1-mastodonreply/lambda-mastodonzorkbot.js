let lastStatusQuery = require('./db_status.js');
let mastodonReplies = require('./mastodon-queryMentions.js');
let mastodonSend = require('./mastodon-send.js');
let config = require('./config/config-mastodon.json');
let parser = require('./mastodon-contentparser.js');

let AWS = require("aws-sdk");
let lambda = new AWS.Lambda();

const MAX_LENGTH_CONT_MESSAGE = " [cont.]";
const REPLY_HASHTAGS = "\n\n#zorkbot";

exports.handler = async (event) => {

    console.log('lambda-mastodonzorkbot called');

    let data = await lastStatusQuery.getLastDbStatus('lastStatusId');

        console.log("Retrieved from table, data: " + JSON.stringify(data));
        let lastRepliedToStatusId = 0;
        if(data != undefined && data.Count > 0){
            lastRepliedToStatusId = data.Items[0].lastReplyId;
        }

        console.log("lastRepliedToStatusId: " + lastRepliedToStatusId);

        //get last status id that was replied to then pass to Mastodon /notifications query
        let lastReplies = await mastodonReplies.queryMentions(lastRepliedToStatusId);
        console.log(`Last replies since id [${lastRepliedToStatusId}] : ${lastReplies.length}`);

        let repliesProcessed = 0;
        if(lastReplies.length > 0){
            //reply to first found in list, process any other replies later on next run
            let mostRecentIdRepliedTo = 0;
            for(let reply of lastReplies){
                if(reply.id > lastRepliedToStatusId){
                    let replyToAccount = reply.account.acct;
                    console.log(`Reply id [${reply.id}] is after last acknowledged id: ${lastRepliedToStatusId} from: ${replyToAccount}`);
                    if(reply.id > mostRecentIdRepliedTo){
                        mostRecentIdRepliedTo = reply.id;
                    }

                    let replyToBotText = reply.status.content;
                    console.log(`reply text: ${replyToBotText}`);

                    //extract text from HTML reply
                    replyToBotText =  parser.extractTextFromContent(replyToBotText);

                    //strip @zorkbot
                    console.log(`Before removing @:${replyToBotText}`);
                    let replyText = replyToBotText.replace(/@[\s]+zorkbot/, '');
                    replyText = replyText.trim();
                    console.log(`...after removing @:${replyText}`);
                    let textReply = `@${replyToAccount} `;
            
                    //TODO integrate with zork lambda here
                    let payload = {
                        "move" : replyText,
                        "userid" : replyToAccount
                    };
                    let result = await lambda.invoke(
                        {
                            FunctionName: "zmachine-mastodonbot-reply-v2-dev-mastodon-reply-v2",
                            Payload: JSON.stringify(payload)
                        }
                    ).promise();
                    
                    console.log("lambda result: " + JSON.stringify(result));
                    
                    //parse and extract result from Payload here
                    let parsedPayload = exports.parseResponse(result);
                
                    console.log("resultPayload: " + parsedPayload);
                    textReply = `${textReply} ${parsedPayload.result}`;

                    //TODO mastodon send api has max 500 chars for the text. if game text is > 500
                    //split into multiple replies
                    //For now, just truncate response
                    if(textReply.length > (500 - MAX_LENGTH_CONT_MESSAGE.length - REPLY_HASHTAGS.length)){
                        textReply = textReply.substring(0, 499 
                            - MAX_LENGTH_CONT_MESSAGE.length - REPLY_HASHTAGS.length);
                        textReply = textReply + MAX_LENGTH_CONT_MESSAGE;
                    }
                    
                    //append hsahtags
                    textReply = textReply + REPLY_HASHTAGS;

                    var status = ({
                        'text': textReply
                    });
            
                    if (config['send-enabled'] === "true") {
                        console.log("config.send-enabled: true: sending reply ...");
            
                        //send reply with Mastodon api
                        let result = await mastodonSend.postMastodon(reply.status.id, status);
                        console.log(`postMastodon result: ${JSON.stringify(result)}`);
                    }
                    else {
                        console.log("config.send-enabled: false, not sending reply");
                    }
                    console.log("reply: " + JSON.stringify(status));
                    repliesProcessed = repliesProcessed + 1;
                }
                else{
                    console.log(`Reply id [${reply.id}] is before last acknowledged id: ${lastRepliedToStatusId}, ignoring`);
                }
            }
            
            //TODO check mastondon response and only store lastStatusId if the send was successful

            if(mostRecentIdRepliedTo > 0){
                //update last replied to id with the most recent (highest) in this last processed group
                if(config['tableupdate-enabled'] === 'true'){
                    let updateResult = await lastStatusQuery.updateDbStatus('lastStatusId', mostRecentIdRepliedTo);
                    console.log(`updateDbStatus result: ${JSON.stringify(updateResult)}`);
                }
                else{
                    console.log('Skipping updateDbStatus, config.tableupdate-enabled is false');
                }
            }
        }
        else{
            console.log("... no more recent statuses yet, skipping");
        }
        
        let result = {
            status: '',
            repliesProcessed: repliesProcessed
        }
        if(lastReplies.length === 0){
            result.status = 'No replies since last check';
        }
        else if(repliesProcessed > 0){
            result.status = 'Replies processed';
        }
        else{
            result.status = 'No replies processed';
        }
        return result;
}

exports.nextIntInRange = function(high){
    let next = Math.floor(Math.random() * high);
    console.log('next: ' + next);
    return next;
}

exports.getTextReply = function(){
    let next = this.nextIntInRange(31);
    console.log('next msg index: ' + next);
    let nextMsg = replytext[next];
    console.log('Next msg: ' + nextMsg);
    return nextMsg;
}

exports.parseResponse = (response) => {

    let parsedResponse = JSON.parse(response.Payload);
    console.log("parsedResponse: " + JSON.stringify(parsedResponse));

    return parsedResponse;
}