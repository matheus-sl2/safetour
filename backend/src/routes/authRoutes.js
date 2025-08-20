const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware

const JWT_SECRET = 'safetour';

// Rota de Cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const user = await User.create({ nome, email, senha, tipo });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
  }
});

// Rota de Login (com JWT)
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const isMatch = await User.comparePassword(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    // Cria o payload do JWT
    const payload = {
      userId: user.id,
      userType: user.tipo
    };

    // Gera o token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: token,
      usuario: { id: user.id, nome: user.nome, email: user.email }
    });
    
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login', detalhes: err.message });
  }
});

// Rota de Perfil (protegida por JWT)
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        res.status(200).json({
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo
        });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar perfil do usuário.', detalhes: err.message });
    }
});

module.exports = router;