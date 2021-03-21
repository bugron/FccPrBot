const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

// Ensure that required environment variables are set
if (!process.env.GITHUB_TOKEN) {
  throw new Error(`
    The bot was started without a github account to post with.
    To get started:
    1) Create a new account for the bot
    2) Settings > Personal access tokens > Generate new token
    3) Only check public_repo and click Generate token
    4) Save your token in .env file:

        GITHUB_TOKEN=insert_token_here
  `);
}

if (!process.env.SECRET_TOKEN) {
  throw new Error(`
    Missing your GitHub webhook's secret token
    Read https://developer.github.com/webhooks/securing and
    add one to .env file like shown in the example below:

        SECRET_TOKEN=insert_token_here
  `);
}

if (!process.env.GITHUB_USER) {
  console.warn(`
    There was no github user detected.
    This is fine, but camper-gh-bot won't work with private repos.
    To make camper-gh-bot work with private repos, please expose
    GITHUB_USER and GITHUB_PASSWORD as environment variables.
    The user and password must have access to the private repo
    you want to use.
  `);
}
