const express = require("express");
const { Connect } = require("../../Model/conection");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const query = promisify(Connect.query).bind(Connect);

class UpadateUserEmailController{
    async updateUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const queryString = "SELECT UserEmail FROM tb_usuarios WHERE UserEmail = ?";
            const userExists = await query(queryString, [email]);
            
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
                const emailResponse = await query(emailQuery, [UserEmailBody]);
                if (emailResponse.length > 0) {
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
    
            const queryString2 = `UPDATE tb_usuarios SET ${updates.join(", ")} WHERE UserEmail = ?`;
            values.push(email);
            await query(queryString2, values);
            console.log("Dados atualizados com sucesso");
            return res.status(200).json({ success: true, message: "Dados atualizados com sucesso" });
            
        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Houve um erro no servidor" });
        }
    }
    

}
module.exports = new UpadateUserEmailController()