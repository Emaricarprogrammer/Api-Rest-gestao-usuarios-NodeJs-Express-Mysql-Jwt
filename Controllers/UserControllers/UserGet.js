const express = require("express");
const { Connect } = require("../../Model/conection");
const { promisify } = require("util");

const query = promisify(Connect.query).bind(Connect);

class GetUsersController{
    async getAllUsers(req, res) {
        try {
            const queryString = "SELECT * FROM tb_usuarios";
            const response = await query(queryString);
            if (!response) {
                console.error("Houve um erro ao listar os usuários");
                return res.status(400).json({ success: false, message: "Houve um erro ao listar os usuários" });
            }
            console.log("Dados resgatados com sucesso");
            return res.status(200).json({ success: true, message: "Dados resgatados com sucesso", data: response });
        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Houve um erro no servidor" });
        }
}
}

module.exports = new GetUsersController()
