const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.generateToken = (payload) => {
  if (!payload.id || !payload.role) {
    throw new Error('Payload must contain id and role');
  }

  const token = jwt.sign(payload, secret, { expiresIn: '7d' });

  console.log('🔐 Generated JWT payload:', payload);
  console.log('🔑 Token:', token);

  return token;
};

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded.id) {
      throw new Error('Token is missing user ID');
    }

    return decoded;
  } catch (err) {
    throw new Error('Invalid token: ' + err.message);
  }
};
