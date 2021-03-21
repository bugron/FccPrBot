/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the docs directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

require('./lib/loadEnvVariables');

const express = require('express');
const path = require('path');
const processPullRequest = require('./lib/processPullRequest');
const payloadValidator = require('./lib/payloadValidator');

const app = express();

app.post('/', express.json(), payloadValidator, (req, res, next) => {
  if (!req.body) {
    res.status(400).end();
  }

  processPullRequest(req.body)
    .then(() => res.end())
    .catch(next);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('An internal error occured');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
