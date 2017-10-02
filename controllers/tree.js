'use strict';

require('dotenv').config();

const { Vault } = require('../lib/vault');

module.exports = async (req, res, next) => {

  let VAULT_URL = process.env.VAULT_URL || req.get('vault-url');
  const VAULT_TOKEN = process.env.VAULT_TOKEN || req.get('vault-token');

  const VAULT_EXCLUDE = process.env.VAULT_EXCLUDE || req.get('vault-exclude');
  const VAULT_DEPTH = process.env.VAULT_DEPTH || req.get('vault-depth');

  const exclude = VAULT_EXCLUDE ? VAULT_EXCLUDE.split(',') : false;

  const vault = new Vault(VAULT_URL, VAULT_TOKEN, { depth: VAULT_DEPTH, exclude });

  try {
    const secrets = await vault.fetchTree();
    res.status(200).json(secrets);
    
  } catch (err) {
    res.status(500).send(err);
  }

};
