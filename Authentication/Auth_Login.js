const mysql = require("mysql");
const { Connect } = require("../Model/conection");
const { promisify } = require("util");
const query = promisify(Connect.query).bind(Connect);
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../Configs/config");

const Login = {
    login: async function(req, res) {
        try {
            const { UserEmailBody, UserPasswordBody } = req.body;

            // Verificar se os campos estão preenchidos
            if (!UserEmailBody || !UserPasswordBody) {
                return res.status(400).json({ message: "Preencha todos os campos" });
            }

            // Consulta ao banco de dados para obter o usuário pelo email
            const queryString = "SELECT * FROM tb_usuarios WHERE UserEmail = ?";
            const users = await query(queryString, [UserEmailBody]);

            // Verificar se o usuário foi encontrado
            if (users.length === 0) {
                return res.status(401).json({ message: "Credenciais Inválidas" });
            }

            const user = users[0];

            // Comparar a senha fornecida com a senha armazenada no banco de dados
            const passwordCompare = bcrypt.compareSync(UserPasswordBody, user.UserPassword);
            if (!passwordCompare) {
                return res.status(401).json({ message: "Credenciais Inválidas" });
            }

            // Gerar um token JWT se a autenticação for bem-sucedida
            const token = JWT.sign({ userId: user.id_usuario }, config.JWT_SECRET);
            

            // Responder com sucesso, retornando o token e os dados do usuário
            return res.status(200).json({ user, token, isLogged: true });

        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ message: "Houve um erro de servidor" });
        }
    }
};

module.exports = { Login };
