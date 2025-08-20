const db = require('../config/firebase');

class Alert {
  static async create({ usuarioId, localizacao, tipo = 'emergencia' }) {
    const ref = db.ref('alertas').push();
    await ref.set({
      usuarioId,
      localizacao,
      tipo, // Adiciona o tipo de alerta
      timestamp: Date.now(),
      status: 'ativo',
      reacoes: {} // Campo para armazenar as reações dos usuários
    });
    return ref.key; // Retorna o ID do alerta
  }

  static async findById(id) {
    const snapshot = await db.ref(`alertas/${id}`).once('value');
    return snapshot.val();
  }

  static async addReaction(id, usuarioId) {
    const ref = db.ref(`alertas/${id}/reacoes`);
    await ref.update({
      [usuarioId]: true // Adiciona a reação do usuário
    });
    const snapshot = await ref.once('value');
    return snapshot.numChildren(); // Retorna o número de reações
  }

  static async findAll() {
    const snapshot = await db.ref('alertas').once('value');
    return snapshot.val();
  }
}

module.exports = Alert;