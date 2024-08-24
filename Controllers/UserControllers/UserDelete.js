const express = require("express");
const { Connect } = require("../../Model/conection");
const { promisify } = require("util");

const query = promisify(Connect.query).bind(Connect);

class DeleteUserController{
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const queryString = "DELETE FROM tb_usuarios WHERE id_usuario = ?";
            const results = await query(queryString, [id]);
            
            if (results.affectedRows === 0) {
                console.log("Usuário inválido");
                return res.status(404).json({ success: false, message: "Usuário inválido" });
            }
            console.log("Usuário deletado com sucesso");
            return res.status(200).json({ success: true, message: "Usuário deletado com sucesso" });
    
        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Houve um erro no servidor" });
        }
    }

}
module.exports = new DeleteUserController()