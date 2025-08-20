const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');
const Autoridade = require('../models/Autoridade'); // Importa o novo modelo
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para acionar um alerta de emergência (agora com o retorno da autoridade)
router.post('/emergencia', async (req, res) => {
  try {
    const { usuarioId, localizacao } = req.body;
    const alertaId = await Alert.create({ usuarioId, localizacao, tipo: 'emergencia' });
    
    // Busca a autoridade mais próxima (simulado para o protótipo)
    const autoridade = await Autoridade.getByLocation(localizacao);

    res.status(200).json({ 
        mensagem: 'Alerta de emergência enviado!', 
        alertaId,
        autoridade // Retorna os dados da autoridade
    });
  } catch (err) {
    res.status(500).json({ erro: 'Falha no botão de emergência' });
  }
});

// Nova rota para reportar uma área de risco (sem alterações)
router.post('/reportar-risco', async (req, res) => {
    try {
        const { usuarioId, localizacao } = req.body;
        const alertaId = await Alert.create({ usuarioId, localizacao, tipo: 'risco' });
        res.status(200).json({ mensagem: 'Área de risco reportada!', alertaId });
    } catch (err) {
        res.status(500).json({ erro: 'Falha ao reportar área de risco' });
    }
});

// Nova rota para adicionar uma reação a um alerta (sem alterações)
router.post('/reagir/:alertaId', async (req, res) => {
    try {
        const { usuarioId } = req.body;
        const { alertaId } = req.params;
        const totalReacoes = await Alert.addReaction(alertaId, usuarioId);
        res.status(200).json({ mensagem: 'Reação adicionada!', totalReacoes });
    } catch (err) {
        res.status(500).json({ erro: 'Falha ao reagir ao alerta' });
    }
});

// Rota para buscar todos os alertas (sem alterações)
router.get('/alertas', async (req, res) => {
  try {
    const alertas = await Alert.findAll();
    res.status(200).json(alertas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar alertas' });
  }
});

router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // req.user.userId é o ID do usuário do token
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