const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Usuarios WHERE role IN ($1, $2)', ['Telefonista', 'Telefonista Supervisora']);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar telefonistas' });
  }
});

router.post('/', async (req, res) => {
  const { nome, email, senha, concessionaria_id, role } = req.body;
  try {
    const validRole = role === 'Telefonista Supervisora' ? 'Telefonista Supervisora' : 'Telefonista';
    const query = 'INSERT INTO Usuarios (nome, email, senha, role, concessionaria_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nome, email, senha, validRole, concessionaria_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar telefonista' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, concessionaria_id, role } = req.body;
  try {
    const validRole = role === 'Telefonista Supervisora' ? 'Telefonista Supervisora' : 'Telefonista';
    const query = 'UPDATE Usuarios SET nome = $1, email = $2, senha = $3, concessionaria_id = $4, role = $5 WHERE id = $6 AND role IN ($7, $8) RETURNING *';
    const values = [nome, email, senha, concessionaria_id, validRole, id, 'Telefonista', 'Telefonista Supervisora'];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Telefonista não encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar telefonista' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Usuarios WHERE id = $1 AND role IN ($2, $3) RETURNING *';
    const result = await pool.query(query, [id, 'Telefonista', 'Telefonista Supervisora']);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Telefonista não encontrado' });
    res.status(200).json({ message: 'Telefonista deletado com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar telefonista' });
  }
});

module.exports = router;