const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  console.log('Requisição recebida:', req.body);
  const { email, senha } = req.body;
  console.log('Consultando usuário:', email);
  try {
    const result = await pool.query('SELECT * FROM Usuarios WHERE email = $1', [email]);
    console.log('Resultado da query:', result.rows);
    const user = result.rows[0];

    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    console.log('Verificando senha para:', user.email);
    if (user.senha !== senha) {
      console.log('Senha incorreta');
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'sua_chave_secreta',
      { expiresIn: '1h' }
    );

    console.log('Token gerado:', token);
    res.status(200).json({ token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

module.exports = router;