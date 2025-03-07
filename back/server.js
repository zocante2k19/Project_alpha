const express = require('express');
const cors = require('cors');
const app = express();

// Configurar CORS para permitir requisições do frontend (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000', // Permitir apenas o frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true // Permitir cookies ou autenticação, se necessário
}));

app.use(express.json());

const superAdminRouter = require('./src/routes/superAdmin');
const concessionariasRouter = require('./src/routes/concessionarias');
const gestoresRouter = require('./src/routes/gestores');
const telefonistasRouter = require('./src/routes/telefonistas');
const tecnicosRouter = require('./src/routes/tecnicos');
const clientesRouter = require('./src/routes/clientes');
const veiculosRouter = require('./src/routes/veiculos');
const agendamentosRouter = require('./src/routes/agendamentos');
const statusRouter = require('./src/routes/status');
const servicosRouter = require('./src/routes/servicos');
const localRouter = require('./src/routes/local');
const tipoAgendamentoRouter = require('./src/routes/tipoAgendamento');
const relatoriosRouter = require('./src/routes/relatorios');
const authRouter = require('./src/routes/auth');

console.log('superAdminRouter:', superAdminRouter);
console.log('concessionariasRouter:', concessionariasRouter);
console.log('gestoresRouter:', gestoresRouter);
console.log('telefonistasRouter:', telefonistasRouter);
console.log('tecnicosRouter:', tecnicosRouter);
console.log('clientesRouter:', clientesRouter);
console.log('veiculosRouter:', veiculosRouter);
console.log('agendamentosRouter:', agendamentosRouter);
console.log('statusRouter:', statusRouter);
console.log('servicosRouter:', servicosRouter);
console.log('localRouter:', localRouter);
console.log('tipoAgendamentoRouter:', tipoAgendamentoRouter);
console.log('relatoriosRouter:', relatoriosRouter);
console.log('authRouter:', authRouter);

app.use('/api/superadmin', superAdminRouter);
app.use('/api/concessionarias', concessionariasRouter);
app.use('/api/gestores', gestoresRouter);
app.use('/api/telefonistas', telefonistasRouter);
app.use('/api/tecnicos', tecnicosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/veiculos', veiculosRouter);
app.use('/api/agendamentos', agendamentosRouter);
app.use('/api/status', statusRouter);
app.use('/api/servicos', servicosRouter);
app.use('/api/local', localRouter);
app.use('/api/tipoagendamento', tipoAgendamentoRouter);
app.use('/api/relatorios', relatoriosRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});