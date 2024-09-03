!([url-da-imagem.png](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.toptal.com%2Fnodejs%2Fsecure-rest-api-in-nodejs&psig=AOvVaw0B7Oh6SfOvYkYZ80UBHnJY&ust=1725463549319000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPiow-WKp4gDFQAAAAAdAAAAABAE))

## Estrutura de Pastas

1. **Authentication**: Contém arquivos relacionados à autenticação e proteção de rotas.
2. **Configs**: Contém configurações gerais, como a configuração JWT.
3. **Controllers**: Lida com as operações de CRUD de usuários.
4. **Model**: Conexão com o banco de dados MySQL.
5. **Routes**: Define as rotas da API.

## Rotas da API

### Rota Principal
- **GET** `/api/` - Verifica se a API está online.

### Autenticação

- **POST** `/api/auth/signup` - Registra um novo usuário.
    ```json
    {
        "UserNameBody": "Nome do Usuário",
        "UserProfileNameBody": "Nome de Perfil",
        "UserEmailBody": "email@exemplo.com",
        "UserPasswordBody": "SenhaSegura123@"
    }
    ```
    - **Response Sucesso (201):**
        ```json
        {
          "success": true,
          "message": "Usuário criado com sucesso"
        }
        ```
    - **Response 400 (Campos Faltando):**
        ```json
        {
          "success": false,
          "message": "Oooops!! Verifique se preencheu todos os campos"
        }
        ```
    - **Response 400 (Email Já em Uso):**
        ```json
        {
          "success": false,
          "message": "Este email já está em uso"
        }
        ```
    - **Response 400 (Senha Não Atende aos Critérios de Segurança):**
        ```json
        {
          "success": false,
          "message": "Por motivos de segurança a sua senha deve ter pelo menos 8 caracteres, incluir letras, números e pelo menos um caractere especial (@$!%*#?&)"
        }
        ```

- **POST** `/api/auth/login` - Autentica o usuário e retorna um token JWT.
    ```json
    {
      "UserEmailBody": "email@exemplo.com",
      "UserPasswordBody": "SenhaSegura123@"
    }
    ```
    - **Response Sucesso (200):**
        ```json
        {
            "user": {
                "id_usuario": 1,
                "UserName": "João",
                "UserProfileName": "joao_perfil",
                "UserEmail": "joao@exemplo.com",
                "UserPassword": "senha_hashed"
            },
            "token": "seu_token_jwt",
            "isLogged": true
        }
        ```
    - **Response 400 (Credenciais Inválidas):**
        ```json
        {
          "success": false,
          "message": "Credenciais inválidas"
        }
        ```

### Usuários

- **GET** `/api/getAllUsers` - Retorna todos os usuários (rota protegida).
    - **Request**:
      ```http
      Authorization: Bearer seu_token_jwt
      ```
    - **Response Sucesso (200):**
        ```json
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
        ```
    - **Response Erro na Consulta (400):**
        ```json
        {
          "success": false,
          "message": "Erro ao buscar usuários"
        }
        ```

- **GET** `/api/getUserById/:id` - Retorna um usuário por ID (rota protegida).
    - **Request**:
      ```http
      Authorization: Bearer seu_token_jwt
      ```
    - **Response Sucesso (200):**
        ```json
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
        ```
    - **Response Usuário Não Encontrado (400):**
        ```json
        {
          "success": false,
          "message": "Usuário não encontrado"
        }
        ```

- **GET** `/api/getUserByEmail/:email` - Retorna um usuário por e-mail (rota protegida).
    - **Request**:
      ```http
      Authorization: Bearer seu_token_jwt
      ```
    - **Response Sucesso (200):**
        ```json
        {
          "response": [
            {
              "id_usuario": 1,
              "UserName": "João",
              "UserProfileName": "joao_perfil",
              "UserEmail": "joao@exemplo.com"
            }
          ]
        }
        ```
    - **Response Usuário Não Encontrado (400):**
        ```json
        {
          "success": false,
          "message": "Usuário não encontrado"
        }
        ```

- **PUT** `/api/updateUser/:id` - Atualiza os dados de um usuário.
    - **Request**:
      ```json
      {
        "UserName": "Novo Nome",
        "UserProfileName": "novo_perfil",
        "UserEmail": "novo_email@exemplo.com",
        "UserPassword": "NovaSenhaSegura123@"
      }
      ```
    - **Response Sucesso (200):**
        ```json
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
        ```
    - **Response Erro de Atualização (400):**
        ```json
        {
          "success": false,
          "message": "Erro ao atualizar o usuário"
        }
        ```

- **PUT** `/api/updateByEmail/:email` - Atualiza os dados de um usuário por e-mail.
    - **Request**:
      ```json
      {
        "UserName": "Novo Nome",
        "UserProfileName": "novo_perfil",
        "UserEmail": "novo_email@exemplo.com",
        "UserPassword": "NovaSenhaSegura123@"
      }
      ```
    - **Response Sucesso (200):**
        ```json
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
        ```
    - **Response Erro de Atualização (400):**
        ```json
        {
          "success": false,
          "message": "Erro ao atualizar o usuário"
        }
        ```

- **DELETE** `/api/deleteUser/:id` - Deleta um usuário por ID.
    - **Request**:
      ```http
      Authorization: Bearer seu_token_jwt
      ```
    - **Response Sucesso (200):**
        ```json
        {
          "success": true,
          "message": "Usuário deletado com sucesso"
        }
        ```
    - **Response Erro ao Deletar (400):**
        ```json
        {
          "success": false,
          "message": "Erro ao deletar o usuário"
        }
        ```

## Autenticação
A API utiliza JSON Web Tokens (JWT) para autenticação. Ao fazer login, o usuário recebe um token que deve ser incluído no cabeçalho das requisições subsequentes às rotas protegidas.

**Exemplo de cabeçalho de autorização:**

    Authorization: Bearer seu_token_jwt

## Proteção de Rotas
Qualquer tentativa de acessar uma rota protegida sem o token ou com um token inválido resultará em uma resposta de erro 401 (não autorizado).

## Erros Comuns
- **404** - Recurso não encontrado.
- **401** - Não autorizado (token inválido ou ausente).

## Licença
Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.
=======
