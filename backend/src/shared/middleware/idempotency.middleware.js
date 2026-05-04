const idempotencyKeys = new Map(); // Simple in-memory storage, replace with Redis in production

const idempotencyMiddleware = (req, res, next) => {
  const key = req.headers['idempotency-key'];

  if (!key) {
    return next();
  }

  if (idempotencyKeys.has(key)) {
    const cachedResponse = idempotencyKeys.get(key);
    return res.status(cachedResponse.status).json(cachedResponse.body);
  }

  // Intercept res.json to cache the response
  const originalJson = res.json;
  res.json = function (body) {
    idempotencyKeys.set(key, {
      status: res.statusCode,
      body: body,
      timestamp: new Date()
    });
    return originalJson.call(this, body);
  };

  next();
};

module.exports = idempotencyMiddleware;
