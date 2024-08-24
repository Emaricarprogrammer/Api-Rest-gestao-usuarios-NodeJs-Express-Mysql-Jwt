const express = require("express");
const { Connect } = require("../Model/conection");
const bcrypt = require("bcryptjs");
const Jwt = require('jsonwebtoken');
const config = require("../Configs/config");
const { promisify } = require("util");

const query = promisify(Connect.query).bind(Connect);

const User = {
    create: async function (req, res) {
        try {
            const { UserNameBody, UserProfileNameBody, UserEmailBody, UserPasswordBody } = req.body;

            if (!UserNameBody || !UserProfileNameBody || !UserEmailBody || !UserPasswordBody) {
                return res.status(400).json({ success: false, message: "Dados Inválidos" });
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
                console.log("A senha deve ter pelo menos 8 caracteres, incluir letras, números e pelo menos um caractere especial (@$!%*#?&)");
                return res.status(400).json({ success: false, message: "A senha deve ter pelo menos 8 caracteres, incluir letras, números e pelo menos um caractere especial (@$!%*#?&)" });
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
    },

    getAllUsers: async function(req, res) {
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
    },

    getUserById: async function(req, res) {
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
    },

    getUserByEmail: async function(req, res) {
        try {
            const { email } = req.params;
            const queryString = "SELECT * FROM tb_usuarios WHERE UserEmail = ?";
            const response = await query(queryString, [email]);
            if (response.length === 0) {
                console.log("Usuário não encontrado");
                return res.status(404).json({ success: false, message: "Usuário não encontrado" });
            }

            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Houve um erro no servidor" });
        }   
    },

    updateUser: async function(req, res) {
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
            return res.status(200).json({ success: true, message: "Dados atualizados com sucesso" });

        } catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Houve um erro no servidor" });
        }
    },

    updateByEmail: async function(req, res) {
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
    },

    deleteUser: async function(req, res) {
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
};

module.exports = { User };
