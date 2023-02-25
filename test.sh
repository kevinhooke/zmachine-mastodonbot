#!/bin/bash
function handler () {
  EVENT_DATA=$1
  echo "$EVENT_DATA" 1>&2;
  #TODO get next move text from event and pipe into dfrotz
  #TODO load game save for current user, save after move
  OUTPUT=$(dfrotz zork1.z3)
  RESPONSE="{ \"result\" : \"${OUTPUT}\" }"

  echo $RESPONSE
}