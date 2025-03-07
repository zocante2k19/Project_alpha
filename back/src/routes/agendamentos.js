// src/routes/agendamentos.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/agendamentos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Agendamentos');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

// POST /api/agendamentos
router.post('/', async (req, res) => {
  const { cliente_id, veiculo_id, tecnico_id, telefonista_id, data_hora, status_id } = req.body;
  try {
    const query = `
      INSERT INTO Agendamentos (cliente_id, veiculo_id, tecnico_id, telefonista_id, data_hora, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [cliente_id, veiculo_id, tecnico_id, telefonista_id, data_hora, status_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// PUT /api/agendamentos/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { cliente_id, veiculo_id, tecnico_id, telefonista_id, data_hora, status_id } = req.body;
  try {
    const query = `
      UPDATE Agendamentos
      SET cliente_id = $1, veiculo_id = $2, tecnico_id = $3, telefonista_id = $4, data_hora = $5, status_id = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [cliente_id, veiculo_id, tecnico_id, telefonista_id, data_hora, status_id, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

// DELETE /api/agendamentos/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Agendamentos WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
  }
});

module.exports = router;