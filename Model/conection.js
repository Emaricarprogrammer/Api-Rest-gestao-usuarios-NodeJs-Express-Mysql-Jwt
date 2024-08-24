const mysql = require("mysql");
require("dotenv").config();

const dbConfig = {
    host: process.env.DB_HOST_URI || "localhost",
    user: process.env.DB_USER_URI || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME_URI || "api_node_mysql"
};

const Connect = mysql.createConnection(dbConfig);

// Função para conectar ao MySQL
const connectToDatabase = () => {
    return new Promise((resolve, reject) => {
        Connect.connect((error) => {
            if (error) {
                reject(error); 
            } else {
                resolve(); 
            }
        });
    });
};

Connect.on('error', (error) => {
    if (error.code === 'ECONNRESET') {
        console.error("Erro: A conexão com o servidor MySQL foi reiniciada. Verifique se o servidor está funcionando corretamente.");
    } else {
        console.error("Erro na conexão com o MySQL:", error.message);
    }
});

connectToDatabase()
    .then(() => {
        console.log("Conectado ao MySQL com sucesso");
    })
    .catch((error) => {
        if (error.code === 'ECONNREFUSED') {
            console.error("Erro: Não foi possível conectar aos servidores, tente novamente.");
        } else {
            console.error("Erro ao conectar ao banco de dados:", error.message);
        }
        process.exit(1); // Finaliza o processo com erro
    });

module.exports = { Connect };


