What does the bot do?
---
The bot finds comments with imperial units, and replies with metric units.

There is a chance it will reply to certain triggers like "good bot" ([see spoilers for what the triggers are](https://github.com/cannawen/metric_units_reddit_bot/blob/master/test/snark-test.js)).

See [./test/converter-test.js](https://github.com/cannawen/metric_units_reddit_bot/blob/master/test/converter-test.js) for what conversions are currently supported, and [see the Tracker for what's coming up next](https://www.pivotaltracker.com/n/projects/2091572)


How does the code work?
---
This is a javascript app built with [Node.js](https://nodejs.org/en/), and all of the app code is in the [src](https://github.com/cannawen/metric_units_reddit_bot/tree/master/src) directory.

The app starts in `bot.js`, this file is responsible for repeatedly checking for new comments and replying to messages in an infinite loop. It uses the following modules:

`converter.js` is responsible taking a message, and deciding which imperial units should be converted to which metric units (if any).

`formatter.js` takes the conversions from above, and constructs a reply to the comment

`helper.js` exists so external dependencies can be easily mocked during test

`network.js` handles get, post, and OAuth network requests and parses the responses for easier consumption

`snark.js` creates snarky responses to certain trigger words


Running the code
---
Create your bot's reddit account.

Create a reddit `script` app through [your reddit preferences](https://www.reddit.com/prefs/apps). (Use `http://localhost` as your redirect url, we don't need it.) From there, you should be able to get your OAuth username and secret

Git clone the code, and create a file `./private/environment.yaml` that looks like:
```
oauth-username: your-oauth-username
oauth-secret: your-oauth-secret
reddit-username: your-username-here
reddit-password: your-password-here
version: your-bot-version
dev-mode: false #true will print POST requests to the console, instead of actually making the POST to the server
#google-analytics-key: UA-XXXX-XX #optional, if you want to collect analytics
```
run `./lib/deploy.sh` and you should have the bot up and running!


Running the tests
---
run `npm test`

Or, if you want the tests to automatically re-run when you save

run `./lib/watch.sh` (uses [fswatch](https://github.com/emcrisostomo/fswatch))


Git hooks
---
The pre-commit hook will run tests before each commit. It will only allow code to be committed if all tests are passing successfully and there are no unnecessary console.log statements

To enable git hooks, copy the file from the `./hooks` directory into the `./.git/hooks` directory

To skip enabled hooks, include flag `--no-verify` when committing code


Questions or Comments?
---
Feel free to message me [on reddit](https://www.reddit.com/message/compose?to=cannawen&subject=metric%20units%20bot&message=I%20think%20your%20bot%20is) or [open a github issue](https://github.com/cannawen/metric_units_reddit_bot/issues/new)


License
---
This source is distributed under GNU GPLv3

Pull requests or derivative works welcome. <sup>but please don't make an imperial_units_bot just to spite me D:</sup>

