# vault-wrapper
If you need a way to list all secrets from your Hashicorp Vault, this is the dirtiest and least fancy.

The implementation downloads all secrets at a specific path, including children. 

## installation

```sh
git clone git@github.com:doramatadora/vault-wrapper.git
cd vault-wrapper
```

Then:

```js
npm install
```

## environment

You'll need your Vault token in an environment variable. Sample `.env` file:
```sh
VAULT_TOKEN=your-vault-token-here
```

## running

```sh
node app.js
```

With running commentary:
```sh
DEBUG=vault-fetch node app.js
```

## usage

```sh
curl -H "vault-url:YOUR_VAULT_URL" http://localhost:3000/tree
```

Optional: Exclude paths by sending an extra header with comma separated Express 4.x routes - supports wildcards `-H "vault-exclude:(.*)/shared,(.*)/continuous-integration"`

Optional: Limit depth by sending an extra header `-H "vault-depth:4"` - won't go deeper than 4 nodes from the origin.

## response

JSON.
