const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Clientes');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

router.post('/', async (req, res) => {
  const { nome, telefone, email } = req.body;
  try {
    const query = 'INSERT INTO Clientes (nome, telefone, email) VALUES ($1, $2, $3) RETURNING *';
    const values = [nome, telefone, email];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email } = req.body;
  try {
    const query = 'UPDATE Clientes SET nome = $1, telefone = $2, email = $3 WHERE id = $4 RETURNING *';
    const values = [nome, telefone, email, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Clientes WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.status(200).json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

module.exports = router;