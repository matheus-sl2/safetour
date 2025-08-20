const jwt = require('jsonwebtoken');

const JWT_SECRET = 'safetour'; // Use a mesma chave que você usou na rota de login

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido.' });
  }
};

module.exports = authMiddleware;