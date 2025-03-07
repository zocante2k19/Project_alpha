const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM TipoAgendamento');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar tipos de agendamento' });
  }
});

router.post('/', async (req, res) => {
  const { nome } = req.body;
  try {
    const query = 'INSERT INTO TipoAgendamento (nome) VALUES ($1) RETURNING *';
    const values = [nome];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar tipo de agendamento' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    const query = 'UPDATE TipoAgendamento SET nome = $1 WHERE id = $2 RETURNING *';
    const values = [nome, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de agendamento não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar tipo de agendamento' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM TipoAgendamento WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de agendamento não encontrado' });
    res.status(200).json({ message: 'Tipo de agendamento deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar tipo de agendamento' });
  }
});

module.exports = router;