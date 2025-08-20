const pool = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

class User {
  static async create({ nome, email, senha, tipo }) {
    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, tipo
    `;
    const values = [nome, email, hashedPassword, tipo];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findById(id) {
    const query = 'SELECT * FROM usuarios WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = User;