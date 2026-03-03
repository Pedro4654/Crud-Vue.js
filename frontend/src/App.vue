<script setup>
// 1. Importações necessárias
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 2. Variáveis de Estado (O "ref" avisa o Vue que a tela deve atualizar se essas variáveis mudarem)
const produtos = ref([]); // Lista que vai receber os dados do banco
const produtoAtual = ref({ nome: '', descricao: '', preco: '' }); // Dados do formulário
const editando = ref(false); // Controla se estamos criando ou editando
const produtoIdEditando = ref(null); // Guarda o ID do produto que está sendo editado

// A URL do seu backend Node.js
const api = 'http://localhost:3000/produtos'; 

// 3. Funções (O CRUD no Frontend)

// READ - Busca os produtos no Node.js
const buscarProdutos = async () => {
  try {
    const resposta = await axios.get(api);
    produtos.value = resposta.data; // Atualiza a variável com os dados do banco
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
  }
};

// CREATE e UPDATE - Salva o formulário
const salvarProduto = async () => {
  try {
    if (editando.value) {
      // Se estiver editando, faz um PUT na URL com o ID
      await axios.put(`${api}/${produtoIdEditando.value}`, produtoAtual.value);
    } else {
      // Se for novo, faz um POST
      await axios.post(api, produtoAtual.value);
    }
    
    // Limpa o formulário e busca a lista atualizada
    produtoAtual.value = { nome: '', descricao: '', preco: '' };
    editando.value = false;
    produtoIdEditando.value = null;
    buscarProdutos();
  } catch (erro) {
    console.error('Erro ao salvar produto:', erro);
  }
};

// Prepara o formulário para editar
const prepararEdicao = (produto) => {
  produtoAtual.value = { nome: produto.nome, descricao: produto.descricao, preco: produto.preco };
  editando.value = true;
  produtoIdEditando.value = produto.id;
};

// DELETE - Apaga um produto
const deletarProduto = async (id) => {
  if (confirm('Tem certeza que deseja excluir?')) {
    try {
      await axios.delete(`${api}/${id}`);
      buscarProdutos(); // Atualiza a lista após deletar
    } catch (erro) {
      console.error('Erro ao deletar produto:', erro);
    }
  }
};

// 4. Ciclo de Vida: Quando a tela carregar, busca os produtos automaticamente
onMounted(() => {
  buscarProdutos();
});
</script>

<template>
  <div class="container">
    <h1>Cadastro de Produtos (Vue + Node + MySQL)</h1>

    <form @submit.prevent="salvarProduto">
      <input type="text" v-model="produtoAtual.nome" placeholder="Nome do Produto" required />
      <input type="text" v-model="produtoAtual.descricao" placeholder="Descrição" required />
      <input type="number" step="0.01" v-model="produtoAtual.preco" placeholder="Preço" required />
      
      <button type="submit">
        {{ editando ? 'Atualizar Produto' : 'Cadastrar Produto' }}
      </button>
      
      <button type="button" v-if="editando" @click="editando = false; produtoAtual = {nome:'', descricao:'', preco:''}">
        Cancelar Edição
      </button>
    </form>

    <hr />

    <h2>Lista de Produtos</h2>
    <ul>
      <li v-for="produto in produtos" :key="produto.id">
        <strong>{{ produto.nome }}</strong> - R$ {{ produto.preco }}
        <p>{{ produto.descricao }}</p>
        
        <button @click="prepararEdicao(produto)">Editar</button>
        <button @click="deletarProduto(produto.id)">Excluir</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Um CSS básico apenas para não ficar tudo grudado */
.container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
input, button { padding: 10px; font-size: 16px; }
li { border: 1px solid #ccc; margin-bottom: 10px; padding: 10px; list-style: none; }
button { cursor: pointer; margin-right: 5px; }
</style>
