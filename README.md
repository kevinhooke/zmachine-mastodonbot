# zmachine-mastodonbot
AWS Lambda based Mastodon bot wrapper for the frotz zmachine


lambda: mastodonbot-zorkbot-dev-mastodon-reply

This lambda is a scheduled Lambda that uses the Mastodon apis to check for replies '@' the Mastodon account
being used for the bot. When a message is received, it calls the next lamdba to handle the move command from the user's message
This lamdba calls the next Lamdba below.


lambda: zmachine-mastodonbot-reply-v2-dev-mastodon-reply-v2

This Lambda is a wrapper that invokes the Custom Runtime Lambda that executes the frotz executable. It parses the text
output returned from frotz to exact just the text for the last game move. This lambda calls the next Lamdba below.


lambda: custom-lambda-zork-dev-test
This is a Custom Runtime Lambda packaged as a Docker Container. It executes the frotz executable and returns the text output from frotz to the calling
Lambda for parsing.
