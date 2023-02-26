#!/bin/bash
function handler () {
  EVENT_DATA=$1
  echo "$EVENT_DATA" 1>&2;

  #parse the move value and emit as raw unquoted text
  MOVE=$(echo "$EVENT_DATA" | jq -r .move)

  #TODO load game save for current user, save after move
  #to save, pipe: save\nfilename
  #to load, pipe: restore\nfilename
  OUTPUT=$(echo "$MOVE" | dfrotz zork1.z3)
  echo "$OUTPUT" 1>&2;
  RESPONSE="{ \"result\" : \"${OUTPUT}\" }"

  # is aws cli present?
  aws s3 cp /tmp/test.zql s3://zmachine-bot-savegames/test.zql
  echo $RESPONSE
}