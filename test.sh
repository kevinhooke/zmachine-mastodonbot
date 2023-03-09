#!/bin/bash
function handler () {
  EVENT_DATA=$1
  echo "$EVENT_DATA" 1>&2;

  #parse the move value and emit as raw unquoted text
  MOVE=$(echo "$EVENT_DATA" | jq -r .move)
  USERID=$(echo "$EVENT_DATA" | jq -r .userid)

  #TODO load game save for current user, save after move
  #to save, pipe: save\nfilename
  #to load, pipe: restore\nfilename
  
  # use aws cli to copy savegame file from /tmp/$USERID.qzl to s3 bucket
  # if s3 cp doesn't find the file, set S3OUTPUT to "no-save-file" to skip loading the save game
  S3OUTPUT=$(aws s3 cp s3://zmachine-bot-savegames/$USERID.qzl /tmp/$USERID.qzl || echo "no-save-file")

  #first game save:
  #>Please enter a filename [zork1.qzl]: Ok.\n\n>There was no verb in that sentence!\
  #subsequent game save
  # "Overwrite existing file?" : echo "Y";

  #if game save file not found, start game with the move command, otherwise load the file
  if [[ $S3OUTPUT == "no-save-file" ]]
  then
    OUTPUT=$( (echo "$MOVE"; echo "save"; echo "/tmp/$USERID.qzl"; echo "Y"; echo "quit"; echo "";) | dfrotz zork1.z3)
  else
    OUTPUT=$( (echo "restore"; echo "/tmp/$USERID.qzl"; echo "$MOVE"; echo "save"; echo "/tmp/$USERID.qzl"; echo "Y"; echo "quit"; echo "";) | dfrotz zork1.z3)
  fi
  echo "$OUTPUT" 1>&2;
  RESPONSE="{ \"result\" : \"$OUTPUT\" }"

  # use aws cli to copy savegame file from /tmp/$USERID.qzl to s3 bucket
  S3OUTPUT=$(aws s3 cp /tmp/$USERID.qzl s3://zmachine-bot-savegames/$USERID.qzl)
  echo "$RESPONSE"
}