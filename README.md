# warranted-node
A helper library for using the Warranted.io API.

## Installation
`npm install warranted` or `yarn add warranted`

### Test your installation
To make sure the installation was successful, try hitting the `/api/v1/me` API, like this:
```js
// Your AccountSID and Auth Token from https://app.warranted.io/settings/webhook
const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = 'your_auth_token';

const client = require('warranted')(accountSid, authToken);

client.me.get().then((message) => console.log(message.sid));
```