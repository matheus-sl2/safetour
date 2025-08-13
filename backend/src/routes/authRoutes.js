const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const user = await User.create({ nome, email, senha, tipo });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
  }
});

module.exports = router;