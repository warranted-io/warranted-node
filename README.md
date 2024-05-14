# warranted-node
A helper library for using the Warranted.io API.

## Installation
`npm install warranted` or `yarn add warranted`

### Test your installation
To make sure the installation was successful, try hitting the `/api/v1/me` API, like this:
```js
const client = require('warranted');

// Get your Account Id and Auth Token from https://app.warranted.io/settings/webhook
const accountId = process.env.WARRANTED_ACCOUNT_ID;
const authToken = process.env.WARRANTED_AUTH_TOKEN;
const warrantedClient = new client(accountId, authToken);

// Fetch and print the response object
const response = await warrantedClient.me.get();
console.log(response);
```

## Usage
Check out [our docs](https://app.warranted.io/docs) for more details.