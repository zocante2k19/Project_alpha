const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Concessionarias');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar concessionarias' });
  }
});

router.post('/', async (req, res) => {
  const { nome, endereco, numero, cidade, estado, cep, cnpj, telefone, email, responsavel_id } = req.body;
  try {
    const query = `
      INSERT INTO Concessionarias (nome, endereco, numero, cidade, estado, cep, cnpj, telefone, email, responsavel_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [nome, endereco, numero, cidade, estado, cep, cnpj, telefone, email, responsavel_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao criar concessionaria' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, endereco, numero, cidade, estado, cep, cnpj, telefone, email, responsavel_id } = req.body;
  try {
    const query = `
      UPDATE Concessionarias
      SET nome = $1, endereco = $2, numero = $3, cidade = $4, estado = $5, cep = $6, cnpj = $7, telefone = $8, email = $9, responsavel_id = $10
      WHERE id = $11
      RETURNING *;
    `;
    const values = [nome, endereco, numero, cidade, estado, cep, cnpj, telefone, email, responsavel_id, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Concessionaria não encontrada' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao atualizar concessionaria' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Concessionarias WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Concessionaria não encontrada' });
    res.status(200).json({ message: 'Concessionaria deletada com sucesso' });
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao deletar concessionaria' });
  }
});

module.exports = router;