const crypto = require('crypto');
const { timingSafeEqual } = require('./utils');

/**
 * An Express middleware for checking Github webhook
 * payload signatures (SHA1 and SHA256)
 */
module.exports = function payloadValidator(req, res, next) {
  // Load SHA1 signature by default
  let algorithm = 'sha1';
  let signature = req.headers['x-hub-signature'];

  // Use SHA256 signature if provided to ensure better security
  if (req.headers['x-hub-signature-256']) {
    algorithm = 'sha256';
    signature = req.headers['x-hub-signature-256'];
  }

  // Throw an error if no signature is found in the request
  if (!signature) {
    return next(new Error('No signature is provided in request headers'));
  }

  // Compute SHA1 or SHA256 signature of the payload
  // SECRET_TOKEN is the same one provided in webhook's settings on Github
  const computedSignature = `${algorithm}=${crypto
    .createHmac(algorithm, process.env.SECRET_TOKEN)
    .update(Buffer.from(JSON.stringify(req.body), 'utf8')).digest('hex')}`;

  // Perform a "constant time" string comparison, which helps mitigate
  // certain timing attacks against regular equality operators
  // see https://docs.github.com/en/developers/webhooks-and-events/securing-your-webhooks
  if (!timingSafeEqual(computedSignature, signature)) {
    console.error('This request is not secure! Aborting.');
    return res.sendStatus(403);
  }

  // At this point everything is OK, so we move on to the next middleware
  next();
}
