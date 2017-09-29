# vault-wrapper
If you need a way to list all secrets from your Hashicorp Vault, this is the dirtiest and least fancy.

The implementation assumes a very specific structure (`VAULT_URL/repo/buildenvironment/`) because it suits me thusly at this time. 

## installation

```sh
git clone git@github.com:doramatadora/vault-wrapper.git
cd vault-wrapper
```

Then:

```js
npm install
```

## running
```js
node app.js
```

## usage
```sh
curl -H "vault-url:YOUR_VAULT_URL" -H "vault-token:YOUR_VAULT_TOKEN" http://localhost:3000
```

Optional: Wrangle your environments by sending an extra header and comma separated values `-H "vault-environments:ENV1,ENV2"`

## response
JSON.
