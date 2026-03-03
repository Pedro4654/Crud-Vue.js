// Biblioteca mysql2
const mysql = require('mysql2');

// Conexão com o banco
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',     
    database: 'portfolio_crud' 
});

// Teste de conexão 
db.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar com o banco:', erro);
        return;
    }
    console.log('Conectado ao banco de dados');
});

module.exports = db;