// app.js - Programa simples para gerenciar categorias da padaria
// Usamos módulos nativos do Node.js: 'fs' para arquivos e 'path' para caminhos

// Importamos os módulos (usando CommonJS, como na aula)
const fs = require('fs');  // Módulo para trabalhar com arquivos (ler/escrever)
const path = require('path');  // Módulo para caminhos de arquivos (funciona em Windows/Linux/Mac)

// Caminho para o arquivo de dados (usamos 'path' para ser seguro em qualquer computador)
const categoriesFile = path.join(__dirname, 'categories.json');

// Função para ler as categorias do arquivo
function readCategories() {
  try {
    // Lê o arquivo como texto e transforma em objeto JavaScript
    const data = fs.readFileSync(categoriesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se der erro (ex: arquivo não existe), mostra mensagem e retorna lista vazia
    console.log('Erro ao ler categorias:', error.message);
    return [];
  }
}

// Função para salvar as categorias no arquivo
function writeCategories(categories) {
  try {
    // Transforma a lista em texto JSON e salva no arquivo
    fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
  } catch (error) {
    console.log('Erro ao salvar categorias:', error.message);
  }
}

// Função para listar todas as categorias
function listCategories() {
  const categories = readCategories();  // Lê as categorias
  if (categories.length === 0) {
    console.log('Nenhuma categoria encontrada.');
    return;
  }
  console.log('Aqui estão as categorias:');
  categories.forEach(cat => {
    console.log(`ID: ${cat.id}, Nome: ${cat.name}, Descrição: ${cat.description}, Ícone: ${cat.icon}`);
  });
}

// Função para buscar uma categoria por ID
function getCategoryById(id) {
  const categories = readCategories();
  const category = categories.find(cat => cat.id === parseInt(id));  // Procura pelo ID
  if (!category) {
    console.log(`Categoria com ID ${id} não encontrada.`);
    return;
  }
  console.log(`Encontrada: ID: ${category.id}, Nome: ${category.name}, Descrição: ${category.description}, Ícone: ${category.icon}`);
}

// Função para adicionar uma nova categoria
function addCategory(name, description, icon) {
  const categories = readCategories();
  // Cria um novo ID (o maior ID + 1)
  const newId = categories.length > 0 ? Math.max(...categories.map(cat => cat.id)) + 1 : 1;
  const newCategory = { id: newId, name, description, icon };
  categories.push(newCategory);  // Adiciona à lista
  writeCategories(categories);  // Salva no arquivo
  console.log(`Nova categoria adicionada! ID: ${newId}, Nome: ${name}`);
}

// Função para atualizar uma categoria
function updateCategory(id, name) {
  const categories = readCategories();
  const categoryIndex = categories.findIndex(cat => cat.id === parseInt(id));  // Encontra o índice
  if (categoryIndex === -1) {
    console.log(`Categoria com ID ${id} não encontrada.`);
    return;
  }
  categories[categoryIndex].name = name;  // Atualiza o nome
  writeCategories(categories);
  console.log(`Categoria atualizada! ID: ${id}, Novo nome: ${name}`);
}

// Agora, vamos ver os comandos digitados no terminal
const args = process.argv.slice(2);  // Pega os argumentos (ex: --list)
if (args.length === 0 || args[0] !== 'categories') {
  console.log('Como usar: node app.js categories [opção]');
  console.log('Opções:');
  console.log('  --list : Mostra todas as categorias');
  console.log('  --id=2 : Busca categoria por ID (ex: 2)');
  console.log('  --add --name="Bebidas" --description="Bebidas quentes" --icon="☕" : Adiciona nova');
  console.log('  --update=4 --name="Salgados Especiais" : Atualiza nome');
  process.exit(1);  // Sai se não for usado certo
}

// Remove 'categories' e processa as opções
args.shift();
let command = null;
let id = null;
let name = null;
let description = null;
let icon = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--list') {
    command = 'list';
  } else if (arg.startsWith('--id=')) {
    command = 'get';
    id = arg.split('=')[1];
  } else if (arg === '--add') {
    command = 'add';
  } else if (arg.startsWith('--update=')) {
    command = 'update';
    id = arg.split('=')[1];
  } else if (arg.startsWith('--name=')) {
    name = arg.split('=')[1].replace(/"/g, '');  // Remove aspas
  } else if (arg.startsWith('--description=')) {
    description = arg.split('=')[1].replace(/"/g, '');
  } else if (arg.startsWith('--icon=')) {
    icon = arg.split('=')[1].replace(/"/g, '');
  }
}

// Executa o comando certo
switch (command) {
  case 'list':
    listCategories();
    break;
  case 'get':
    if (!id) {
      console.log('Precisa de um ID para buscar!');
    } else {
      getCategoryById(id);
    }
    break;
  case 'add':
    if (!name || !description || !icon) {
      console.log('Precisa de nome, descrição e ícone para adicionar!');
    } else {
      addCategory(name, description, icon);
    }
    break;
  case 'update':
    if (!id || !name) {
      console.log('Precisa de ID e nome para atualizar!');
    } else {
      updateCategory(id, name);
    }
    break;
  default:
    console.log('Comando errado. Use --list, --id, --add ou --update.');
}