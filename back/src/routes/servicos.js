const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Servicos');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

router.post('/', async (req, res) => {
  const { nome, preco } = req.body;
  try {
    const query = 'INSERT INTO Servicos (nome, preco) VALUES ($1, $2) RETURNING *';
    const values = [nome, preco];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;
  try {
    const query = 'UPDATE Servicos SET nome = $1, preco = $2 WHERE id = $3 RETURNING *';
    const values = [nome, preco, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Servicos WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.status(200).json({ message: 'Serviço deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar serviço' });
  }
});

module.exports = router;