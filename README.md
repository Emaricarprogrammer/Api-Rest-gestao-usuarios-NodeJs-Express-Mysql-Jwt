# API de Gestão de Usuários

Esta API foi desenvolvida com Node.js, Express, MySQL e JWT para gerenciar usuários, autenticar acessos e proteger rotas.

## Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Rotas da API](#rotas-da-api)
- [Autenticação](#autenticação)
- [Proteção de Rotas](#proteção-de-rotas)
- [Erros Comuns](#erros-comuns)
- [Licença](#licença)

## Instalação

1. Clone o repositório: git clone https://github.com/seu-usuario/nome-do-repositorio.git e entre na pasta
2. Instale os pacotes utilizando o comando `npm install`
3. Crie um arquivo `.env` na raiz do projeto e insira suas credencias. Utilize o arquivo `.env.example` como base.
4. Rode o projeto com o comando `npm start`

## Estrutura de pastas
1. Authentication: Contém arquivos relacionados à autenticação e proteção de rotas.
2. Configs: Contém configurações gerais, como a configuração JWT.
3. Controllers: Lida com as operações de CRUD de usuários.
4. Model: Conexão com o banco de dados MySQL.
5. Routes: Define as rotas da API


## Rotas da API
1. Rota Principal
    GET / - Verifica se a API está online.

2. Autenticação
    POST /auth/signup - Registra um novo usuário.
Request:
{
    "UserNameBody": "Nome do Usuário",
  "UserProfileNameBody": "Nome de Perfil",
  "UserEmailBody": "email@exemplo.com",
  "UserPasswordBody": "SenhaSegura123@"
}

Response Sucesso (201): 
{
  "success": true,
  "message": "Usuário criado com sucesso"
}

Response 400(campos faltando):
{
  "success": false,
  "message": "Oooops!! Verifique se preencheu todos os campos"
}
Response 400(email já em uso):
{
  "success": false,
  "message": "Este email já está em uso"
}
Response 400(senha não atende aos critérios de segurança):
{
  "success": false,
  "message": "Por motivos de segurança a sua senha deve ter pelo menos 8 caracteres, incluir letras, números e pelo menos um caractere especial (@$!%*#?&)"
}

POST /auth/login - Autentica o usuário e retorna um token JWT.
Request:
{
  "UserEmailBody": "email@exemplo.com",
  "UserPasswordBody": "SenhaSegura123@"
}
Response sucesso(200):
{
	"user": {
		"id_usuario": 
		"UserName": 
		"UserProfileName": 
		"UserEmail": 
		"UserPassword": 
	},
	"token": 
	"isLogged":
}
Response 400(credenciais inválidas):
{
  "success": false,
  "message": "credenciais inválidas"
}


3. Usuários
    GET /getAllUsers - Retorna todos os usuários (rota protegida).
    - Request: 
    {"Authorization": "Bearer seu_token_jwt"}

    - Response sucesso (200): 
        {
  "success": true,
  "message": "Usuários encontrados",
  "data": [
    {
      "id_usuario": 1,
      "UserName": "João",
      "UserProfileName": "joao_perfil",
      "UserEmail": "joao@exemplo.com",
      "UserPassword": "senha_hashed"
    },
    {
      "id_usuario": 2,
      "UserName": "Maria",
      "UserProfileName": "maria_perfil",
      "UserEmail": "maria@exemplo.com",
      "UserPassword": "senha_hashed"
    }
  ]
}
- Response erro na consulta(400):
{
  "success": false,
  "message": "Erro ao buscar usuários"
}



GET /getUserById/ - Retorna um usuário por ID (rota protegida).
    Request: 
    {"Authorization": "Bearer seu_token_jwt"}

    - Response 200:
    {
  "success": true,
  "data": [
    {
      "id_usuario": 1,
      "UserName": "João",
      "UserProfileName": "joao_perfil",
      "UserEmail": "joao@exemplo.com",
      "UserPassword": "senha_hashed"
    }
  ]
}

- Response usuário não encontrado (400):
{
  "success": false,
  "message": "Usuário não encontrado"
}


    GET /getUserByEmail/ - Retorna um usuário por e-mail (rota protegida).
    Request:
    {"Authorization": "Bearer seu_token_jwt"}

    - Response sucesso(200):
        {
	"response": [
		{
			"id_usuario":
			"UserName":
			"UserProfileName":
			"UserEmail":
		}
	]
}
- Response usuário não encontrado (400):
{
  "success": false,
  "message": "Usuário não encontrado"
}

PUT /updateUser/:id - Atualiza os dados de um usuário.
- Request:
{
  "UserName": "Novo Nome",
  "UserProfileName": "novo_perfil",
  "UserEmail": "novo_email@exemplo.com",
  "UserPassword": "NovaSenhaSegura123@"
}

- Response sucesso(200):
{
  "success": true,
  "user": [
    {
      "id_usuario": 1,
      "UserName": "Novo Nome",
      "UserProfileName": "novo_perfil",
      "UserEmail": "novo_email@exemplo.com",
      "UserPassword": "nova_senha_hashed"
    }
  ],
  "message": "Usuário atualizado com sucesso"
}
Response erro de atualização (400):
{
  "success": false,
  "message": "Erro ao atualizar o usuário"
}

PUT /updateByEmail/:email - Atualiza os dados de um usuário por e-mail.
- Request:
{
  "UserName": "Novo Nome",
  "UserProfileName": "novo_perfil",
  "UserEmail": "novo_email@exemplo.com",
  "UserPassword": "NovaSenhaSegura123@"
}

- Response sucesso(200):
{
  "success": true,
  "user": [
    {
      "id_usuario": 1,
      "UserName": "Novo Nome",
      "UserProfileName": "novo_perfil",
      "UserEmail": "novo_email@exemplo.com",
      "UserPassword": "nova_senha_hashed"
    }
  ],
  "message": "Usuário atualizado com sucesso"
}
Response erro de atualização (400):
{
  "success": false,
  "message": "Erro ao atualizar o usuário"
}


    
DELETE /deleteUser/ - Deleta um usuário por ID.
- Request:
{
  "Authorization": "Bearer seu_token_jwt"
}
- Response sucesso(200):
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
- Response erro ao deletar(400):
{
  "success": false,
  "message": "Erro ao deletar o usuário"
}


## Autenticação
--A API utiliza JSON Web Tokens (JWT) para autenticação. Ao fazer login, o usuário recebe um token que deve ser incluído no cabeçalho das requisições subsequentes às rotas protegidas. As rotas protegidas exigem que o usuário esteja autenticado e tenha um token JWT válido no cabeçalho da requisição.
Qualquer tentativa de acessar uma rota protegida sem o token ou com um token inválido resultará em uma resposta de erro 401 (não autorizado).

Exemplo de cabeçalho de autorização:
    Authorization: Bearer seu_token_jwt
