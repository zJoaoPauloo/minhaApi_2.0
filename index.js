const express = require('express');
const minhaApi = express();

minhaApi.use(express.json());

const Sequelize = require ('sequelize');

const conexao = new Sequelize('nodejs' , 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

conexao.authenticate()
    .then(() => {
        console.log('conectado com sucesso.');

    }).catch((erro)=>{
        console.log('deu erro', erro);
    });

const Cargo = conexao.define('cargos',{
    codigo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    descricao: {
        type: Sequelize.STRING(150),
        allowNull: false

    }
});


//++++++++++++++++++++++++++++++++ usuario


const funcionario = conexao.define('funcionario',{
    codigo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING(150),
        allowNull: false,

    },
    idade:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cpf:{
        type: Sequelize.STRING(11),
        allowNull: false,
    },
    codigoCargo: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

//chave estrangeira
funcionario.belongsTo(Cargo, { foreignKey: 'codigoCargo' });

conexao.sync()
    .then(() => {
        console.log('Tabelas sincronizadas.');
    })
    .catch((erro)=>{
        console.log('Erro ao sincronizar tabelas', erro);
    });

// Rota para consulta de todos os usuários
minhaApi.get('/funcionario', async (req, res) => {
        const funcionarios = await funcionario.findAll();
        res.send(funcionarios);
    });



// Rota para consulta de um usuário pelo código
minhaApi.get('/funcionario/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const novoFuncionario = await funcionario.findByPk(id);
    res.send(novoFuncionario);
    
});

// Rota para cadastro de um funcionario
minhaApi.post('/funcionario', async (req, res) => {
    const {nome, idade, cpf, codigoCargo } = req.body;
    await funcionario.create({
        nome,
        idade,
        cpf,
        codigoCargo
    })
    res.send("funcionario cadastrado com sucesso");
});

// Rota para atualização de um usuário pelo código
minhaApi.put('/funcionario/:id',async (req, res) => {
    const id = parseInt(req.params.id);
    const novoFuncionario = await funcionario.findByPk(id);
    const {nome, idade, cpf, codigoCargo } = req.body;
    novoFuncionario.nome = nome;
    novoFuncionario.idade = idade;
    novoFuncionario.cpf = cpf;
    novoFuncionario.codigoCargo = codigoCargo;
    novoFuncionario.save();
    res.send(novoFuncionario);
});

// Rota para remoção de um usuário pelo código
minhaApi.delete('/funcionario/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const novoFuncionario = await funcionario.findByPk(id);
    novoFuncionario.destroy();
    res.send("O funcionario foi apagado com sucesso");
});
 
//                                      
//                 Cargos            //
//


// Rota para consulta de todos os cargos
minhaApi.get('/cargos', async (req, res) => {
    const cargos = await Cargo.findAll();
    res.send(cargos);
});


// Rota para cadastro de um cargo
minhaApi.post('/cargos',async (req, res) => {
    const {descricao } = req.body;
    await Cargo.create({
        descricao
    })
    res.send("cargo cadastrado com sucesso");
});


// Rota para atualização de um cargo pelo código
minhaApi.put('/cargos/:id',async (req, res) => {
    const id = parseInt(req.params.id);
    const novoCargo = await Cargo.findByPk(id);
    const {descricao} = req.body;
    novoCargo.descricao = descricao
    res.send(novoCargo);
});


// Rota para remoção de um cargo pelo código
minhaApi.delete('/cargos/:codigo', async (req, res) => {
    const codigo = parseInt(req.params.codigo);
    const novoCargo = await Cargo.findByPk(codigo);
    novoCargo.destroy();
});
 
// Rota para consulta de um cargo pelo código
minhaApi.get('/cargos/:codCargo',async (req, res) => {
    const codCargo = req.params.codCargo;

    const cargos = await Cargo.findAll({
        where: {
            codigo: codCargo
        }
      });
    res.send(cargos);
});


minhaApi.listen(4300, () => {
    console.log("API rodando na porta 4300");
});




 
