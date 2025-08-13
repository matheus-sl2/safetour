const pool = require('../config/db');

class User {
  static async create({ nome, email, senha, tipo }) {
    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, tipo
    `;
    const values = [nome, email, senha, tipo];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }
}

module.exports = User;