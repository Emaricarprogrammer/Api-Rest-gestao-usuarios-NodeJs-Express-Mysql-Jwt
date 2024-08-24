const express = require("express");
const { Connect } = require("../../Model/conection");
const { promisify } = require("util");

const query = promisify(Connect.query).bind(Connect);

class GetUserById{
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const queryString = "SELECT * FROM tb_usuarios WHERE id_usuario = ?";
            const response = await query(queryString, [id]);
            if (response.length === 0) {
                console.log("Usuário não encontrado");
                return res.status(404).json({ success: false, message: "Usuário não encontrado" });
            }

            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Houve um erro no servidor" });
        }

}
}

module.exports = new GetUserById()