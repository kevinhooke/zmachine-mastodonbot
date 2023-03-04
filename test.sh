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
  # (echo "N"; echo "save"; echo "multiple.qzl")
  OUTPUT=$( (echo "$MOVE"; echo "save"; echo "/tmp/$USERID.qzl"; echo "quit"; echo "";) | dfrotz zork1.z3)
  echo "$OUTPUT" 1>&2;
  RESPONSE="{ \"result\" : \"$OUTPUT\" }"

  # use aws cli to copy savegame file from /tmp/$USERID.qzl to s3 bucket
  S3OUTPUT=$(aws s3 cp /tmp/$USERID.qzl s3://zmachine-bot-savegames/$USERID.qzl)
  echo "$RESPONSE"
}