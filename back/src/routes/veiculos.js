const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Veiculos');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar veículos' });
  }
});

router.post('/', async (req, res) => {
  const { modelo, placa, cliente_id } = req.body; // Corrigido para 'cliente_id'
  try {
    const query = 'INSERT INTO Veiculos (modelo, placa, cliente_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [modelo, placa, cliente_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar veículo' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { modelo, placa, cliente_id } = req.body;
  try {
    const query = 'UPDATE Veiculos SET modelo = $1, placa = $2, cliente_id = $3 WHERE id = $4 RETURNING *';
    const values = [modelo, placa, cliente_id, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Veículo não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Veiculos WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Veículo não encontrado' });
    res.status(200).json({ message: 'Veículo deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar veículo' });
  }
});

module.exports = router;