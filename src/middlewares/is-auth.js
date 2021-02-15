import { verify } from 'jsonwebtoken';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const [_, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, 'secret');

    const { sub } = decoded;

    req.isAuth = true;
    req.user = {
      id: sub,
    };

    return next();
  } catch {
    req.isAuth = false;
    return next();
  }
};
