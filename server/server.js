const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const app = express();

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '..', 'public');
const dataDir = path.join(__dirname, '..', 'data');

app.use(express.json());
app.use(express.static(publicDir));

// Helpers
async function readJson(file) {
  const filePath = path.join(dataDir, file);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw || '[]');
}

async function writeJson(file, data) {
  const filePath = path.join(dataDir, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

app.get('/api/depoimentos', async (_req, res) => {
  try {
    const depoimentos = await readJson('depoimentos.json');
    res.json(depoimentos);
  } catch (err) {
    console.error('Erro ao ler depoimentos:', err.message);
    res.status(500).json({ erro: 'N�o foi poss�vel carregar os depoimentos' });
  }
});

app.post('/contato', async (req, res) => {
  const { nome, email, mensagem } = req.body || {};
  if (!nome || !email || !mensagem) {
    res.status(500).json({ erro: 'Não foi possível carregar os depoimentos' });
  }

  try {
    const contatos = await readJson('contatos.json');
    const novo = {
      id: Date.now(),
      nome,
      email,
      mensagem,
      recebidoEm: new Date().toISOString(),
    };
    contatos.push(novo);
    await writeJson('contatos.json', contatos);
    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro ao salvar contato:', err.message);
    res.status(500).json({ erro: 'Não foi possível salvar agora.' });
  }
});

app.listen(PORT, () => {
  console.log(`UrbixGO rodando em http://localhost:${PORT}`);
});
