const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Usuarios WHERE role = $1', ['Tecnico']);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar técnicos' });
  }
});

router.post('/', async (req, res) => {
  const { nome, email, senha, concessionaria_id, especialidade } = req.body;
  try {
    const query = 'INSERT INTO Usuarios (nome, email, senha, role, concessionaria_id, especialidade) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [nome, email, senha, 'Tecnico', concessionaria_id, especialidade];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar técnico' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, concessionaria_id, especialidade } = req.body;
  try {
    const query = 'UPDATE Usuarios SET nome = $1, email = $2, senha = $3, concessionaria_id = $4, especialidade = $5 WHERE id = $6 AND role = $7 RETURNING *';
    const values = [nome, email, senha, concessionaria_id, especialidade, id, 'Tecnico'];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Técnico não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar técnico' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Usuarios WHERE id = $1 AND role = $2 RETURNING *';
    const result = await pool.query(query, [id, 'Tecnico']);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Técnico não encontrado' });
    res.status(200).json({ message: 'Técnico deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar técnico' });
  }
});

module.exports = router;