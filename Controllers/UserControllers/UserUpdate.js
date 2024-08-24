const express = require("express");
const { Connect } = require("../../Model/conection");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const query = promisify(Connect.query).bind(Connect);

class UpdateUserController{
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const queryString = "SELECT id_usuario FROM tb_usuarios WHERE id_usuario = ?";
            const userExists = await query(queryString, [id]);
            
            if (userExists.length === 0) {
                console.log("Usuário inválido");
                return res.status(401).json({ success: false, message: "Usuário inválido" });
            }

            const { UserNameBody, UserProfileNameBody, UserEmailBody, UserPasswordBody } = req.body;

            const updates = [];
            const values = [];

            if (UserNameBody) {
                updates.push("UserName = ?");
                values.push(UserNameBody);
            }

            if (UserProfileNameBody) {
                updates.push("UserProfileName = ?");
                values.push(UserProfileNameBody);
            }

            if (UserEmailBody) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(UserEmailBody)) {
                    console.log("Formato de e-mail inválido");
                    return res.status(400).json({ success: false, message: "Formato de e-mail inválido" });
                }

                const emailQuery = "SELECT UserEmail FROM tb_usuarios WHERE UserEmail = ?";
                const emailresponse = await query(emailQuery, [UserEmailBody]);
                if (emailresponse.length > 0) {
                    console.log("Este email já está em uso");
                    return res.status(400).json({ success: false, message: "Este email já está em uso" });
                }

                updates.push("UserEmail = ?");
                values.push(UserEmailBody);
            }

            if (UserPasswordBody) {
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                if (!passwordRegex.test(UserPasswordBody)) {
                    console.log("A senha deve ter pelo menos 8 caracteres, incluir letras, números e pelo menos um caractere especial (@$!%*#?&)");
                    return res.status(400).json({ success: false, message: "A senha deve ter pelo menos 8 caracteres, incluir letras, números e pelo menos um caractere especial (@$!%*#?&)" });
                }

                const PasswordHashed = bcrypt.hashSync(UserPasswordBody, 12);
                updates.push("UserPassword = ?");
                values.push(PasswordHashed);
            }

            if (updates.length === 0) {
                console.log("Nenhum dado válido fornecido para atualização");
                return res.status(400).json({ success: false, message: "Nenhum dado válido fornecido para atualização" });
            }

            const queryString2 = `UPDATE tb_usuarios SET ${updates.join(", ")} WHERE id_usuario = ?`;
            values.push(id);
            await query(queryString2, values);
            console.log("Dados atualizados com sucesso");
            const queryString3 = "SELECT * FROM tb_usuarios WHERE id_usuario = ?"
            const user = await query(queryString3, [id])
            return res.status(200).json({ success: true, user,message: "Dados atualizados com sucesso" });

        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Houve um erro no servidor" });
        }
    }
}
module.exports = new UpdateUserController()