const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Relatorios');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar relatórios' });
  }
});

router.post('/', async (req, res) => {
  const { titulo, data_inicio, data_fim, usuario_id } = req.body;
  try {
    const query = 'INSERT INTO Relatorios (titulo, data_inicio, data_fim, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [titulo, data_inicio, data_fim, usuario_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar relatório' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, data_inicio, data_fim, usuario_id } = req.body;
  try {
    const query = 'UPDATE Relatorios SET titulo = $1, data_inicio = $2, data_fim = $3, usuario_id = $4 WHERE id = $5 RETURNING *';
    const values = [titulo, data_inicio, data_fim, usuario_id, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar relatório' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Relatorios WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });
    res.status(200).json({ message: 'Relatório deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar relatório' });
  }
});

module.exports = router;