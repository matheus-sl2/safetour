const db = require('../config/firebase');

class Alert {
  static async create({ usuarioId, localizacao }) {
    const ref = db.ref('alertas').push();
    await ref.set({
      usuarioId,
      localizacao,
      timestamp: Date.now(),
      status: 'ativo'
    });
    return ref.key; // Retorna o ID do alerta
  }

  static async findAll() {
    const snapshot = await db.ref('alertas').once('value');
    return snapshot.val();
  }
}

module.exports = Alert;