const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const path = require('path');

const app = express();

// Middlewares 
app.use(cors()); // Permite que o Vue.js (que vai rodar em outra porta) acesse esta API
app.use(express.json()); // Ensina o Express a entender dados enviados no formato JSON


//CREATE
app.post('/produtos', (req, res) => {
    const { nome, descricao, preco } = req.body;
    
    // Confirma se tens exatamente 3 colunas e 3 interrogações
    const sql = 'INSERT INTO produtos (nome, descricao, preco) VALUES (?, ?, ?)';
    
    // O array deve ter a mesma ordem das interrogações
    db.query(sql, [nome, descricao, preco], (erro, resultado) => {
        if (erro) {
            console.log("Erro no MySQL:", erro); // Isto vai mostrar o erro real no terminal
            return res.status(500).json(erro);
        }
        res.status(201).json({ id: resultado.insertId });
    });
});


//READ
app.get('/produtos', (req, res) => {
    // Comando SQL para buscar tudo
    const sql = 'SELECT * FROM produtos';
    
    db.query(sql, (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao buscar produtos' });
        res.status(200).json(resultados); // Devolve os dados em formato JSON
    });
});


//UPDATE
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params; // Pega o ID da URL
    const { nome, descricao, preco } = req.body; // Pega os novos dados
    
    const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?';
    
    db.query(sql, [nome, descricao, preco, id], (erro, resultado) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao atualizar produto' });
        res.status(200).json({ mensagem: 'Produto atualizado com sucesso!' });
    });
});


//DELETE
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params; // Pega o ID da URL
    
    const sql = 'DELETE FROM produtos WHERE id = ?';
    
    db.query(sql, [id], (erro, resultado) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao deletar produto' });
        res.status(200).json({ mensagem: 'Produto deletado com sucesso!' });
    });
});

// Ensina o Node a servir a pasta 'dist' do Vue
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Redireciona qualquer rota que não seja da API para o Vue.js
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));



