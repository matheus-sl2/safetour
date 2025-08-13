require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const admin = require('firebase-admin'); // dps tira essa linha

// Inicialização do Firebase
if (!admin.apps.length) {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => res.send('API SafeTour Online!'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Testa o Firebase (temporario)
const db = admin.database();
db.ref('test').set({ message: 'Conexão OK!' })
  .then(() => console.log('✅ Conexão com Firebase estabelecida!'))
  .catch(err => console.error('❌ Erro no Firebase:', err));