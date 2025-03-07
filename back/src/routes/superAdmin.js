const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SuperAdmin');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar superadmins' });
  }
});

router.post('/', async (req, res) => {
  const { nome, login, senha } = req.body;
  try {
    const query = 'INSERT INTO SuperAdmin (nome, login, senha) VALUES ($1, $2, $3) RETURNING *';
    const values = [nome, login, senha];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar superadmin' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, login, senha } = req.body;
  try {
    const query = 'UPDATE SuperAdmin SET nome = $1, login = $2, senha = $3 WHERE id = $4 RETURNING *';
    const values = [nome, login, senha, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Superadmin não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar superadmin' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM SuperAdmin WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Superadmin não encontrado' });
    res.status(200).json({ message: 'Superadmin deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar superadmin' });
  }
});

module.exports = router;