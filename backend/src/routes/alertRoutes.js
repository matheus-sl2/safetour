const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');

router.post('/emergencia', async (req, res) => {
  try {
    const { usuarioId, localizacao } = req.body;
    const alertaId = await Alert.create({ usuarioId, localizacao });
    res.status(200).json({ mensagem: 'Alerta enviado!', alertaId });
  } catch (err) {
    res.status(500).json({ erro: 'Falha no botão de emergência' });
  }
});

router.get('/alertas', async (req, res) => {
  try {
    const alertas = await Alert.findAll();
    res.status(200).json(alertas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar alertas' });
  }
});

module.exports = router;