'use strict';
const fetch = require('node-fetch');

module.exports = async (req, res, next) => {
  let VAULT_URL = process.env.VAULT_URL || req.get('vault-url');
  const VAULT_TOKEN = process.env.VAULT_TOKEN || req.get('vault-token');

  if(VAULT_URL.substr(-1) !== '/') {
    VAULT_URL = `${VAULT_URL}/`;
  }

  const fetchOpts = (method) => ({
    method,
    headers: {
      'X-Vault-Token': VAULT_TOKEN
    }
  });

  const fetchVault = (url, method) => fetch(url, fetchOpts(method)).then(v => v.json()).catch(() => { });

  try {
    // Get repos
    const { data: { keys: repos } } = await fetchVault(VAULT_URL, 'LIST');

    // Available environments
    let environments = ['continuous-integration', 'development', 'production'];

    if (req.get('vault-environments')) {
      let envFilter = req.get('vault-environments').split(',');
      environments = environments.filter(env => envFilter.some(f => f.toLowerCase() === env));
    }

    let secrets = {};
    let repoEnvironments = [];

    // Repo environments
    for (let repo of repos) {
      repoEnvironments.push(fetchVault(`${VAULT_URL}${repo}`, 'LIST'));
    }

    repoEnvironments = await Promise.all(Object.values(repoEnvironments));

    let resolvedSecrets = [];

    for (let [index, repo] of repos.entries()) {
      let { data: { keys: envs } } = repoEnvironments[index];
      envs = envs.filter(env => environments.some(e => e.toLowerCase() === env));

      secrets[repo] = { envs };

      for (let env of envs) {
        resolvedSecrets.push(fetchVault(`${VAULT_URL}${repo}${env}`, 'GET'));
      }
    }

    resolvedSecrets = await Promise.all(Object.values(resolvedSecrets));

    // Repo secrets
    for (let [i, repo] of repos.entries()) {
      for (let [j, env] of secrets[repo].envs.entries()) {
        let { data } = resolvedSecrets[i + j];
        if (data && !data.__INFO__) {
          secrets[repo][env] = data;
        }
      }
      delete secrets[repo].envs;
    }

    res.status(200).json(secrets);

  } catch (err) {
    res.status(500).send(err);
  }

};
