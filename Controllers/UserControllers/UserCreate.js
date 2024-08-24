const express = require("express");
const { Connect } = require("../../Model/conection");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const query = promisify(Connect.query).bind(Connect);

class UserCreateContoller{
    async create(req, res){
        try {
            const { UserNameBody, UserProfileNameBody, UserEmailBody, UserPasswordBody } = req.body;

            if (!UserNameBody || !UserProfileNameBody || !UserEmailBody || !UserPasswordBody) {
                return res.status(400).json({ success: false, message: "Oooops!! Verifique se preencheu todos os campos" });
            }

            if(typeof(UserNameBody) != "string"){
                return res.status(400).json({ success: false, message: "Oooops!! Verifique o seu nome" });


            }

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

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(UserPasswordBody)) {
                console.log("Por motivos de segurança a sua senha deve ter pelo menos 8 caracteres, incluir letras, números e pelo menos um caractere especial (@$!%*#?&)");
                return res.status(400).json({ success: false, message: "Por motivos de segurança a sua senha deve ter pelo menos 8 caracteres, incluir letras, números e pelo menos um caractere especial (@$!%*#?&)" });
            }

            const PasswordHashed = bcrypt.hashSync(UserPasswordBody, 12);

            const queryString = "INSERT INTO tb_usuarios (id_usuario, UserName, UserProfileName, UserEmail, UserPassword) VALUES (default, ?, ?, ?, ?)";
            await query(queryString, [UserNameBody, UserProfileNameBody, UserEmailBody, PasswordHashed]);
            
            console.log("Usuário criado com sucesso");
            return res.status(201).json({ success: true, message: "Usuário criado com sucesso" });

        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Houve um erro no servidor" });
        }

    }
    
}
module.exports = new UserCreateContoller()
