const { Connect } = require("../Model/conection");
const { promisify } = require("util");
const query = promisify(Connect.query).bind(Connect);
const JWT = require("jsonwebtoken");
const config = require("../Configs/config");

const ProtectedRoute = {
    AuthenticatedRoute: async function(req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                console.log("Cabeçalho de autorização inválido")
                return res.status(401).json({ message: "Erro na autenticação,tente mais tarde" });
            }

            const tokenExtract = authorizationHeader.split(' ')[1];
            if (!tokenExtract) {
                return res.status(401).json({ message: "Token não encontrado" });
            }

            const decoded = JWT.verify(tokenExtract, config.JWT_SECRET);
            const userId = decoded.userId;

            const queryString = "SELECT * FROM tb_usuarios WHERE id_usuario = ?";
            const user = await query(queryString, [userId]);

            if (user.length === 0) {
                return res.status(401).json({ message: "Usuário não encontrado" });
            }

            req.user = user[0]; // Passa o usuário para a próxima função, se necessário
            next(); // Continua para o próximo middleware ou rota

        } catch (error) {
            console.error("Erro ao processar rota protegida: ", error);
            if (error.name === "JsonWebTokenError") {
                console.log("Token inválido")
                return res.status(401).json({ message: "Token não encontrado" });
            }
            return res.status(500).json({ message: "Houve um erro de servidor" });
        }
    }
};

module.exports = { ProtectedRoute };
