# Actions
Github actions TLV7, concentra todas as actions responsaveis por realizar builds, deploys e subidas de aplicações.

## build-api

#### Action build-api faz a criação de imagens Docker a partir de um Dockerfile, criação da tag da imagem Docker e também envia a imagem para um repositório.

```Action
   novacia/actions/build-api@main
```
**Observação:** antes da chamada da action build-api, deve ser chamada a action de checkout

**Exemplo**
```Checkout
    actions/checkout@v3
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `hub` | `string` | **Obrigatório**. Junção do Repositório no Docker Hub + Nome do Projeto |
| `projeto` | `string` | **Obrigatório**. Nome do projeto no Repositório |
| `config` | `string` | **Obrigatório**. Tipo de build (Beta, Rc, Release) |
| `versao-major` | `string` | **Obrigatório**. Quando fizer mudanças incompatíveis na API |
| `versao-minor` | `string` | **Obrigatório**. Quando adicionar funcionalidades mantendo compatibilidade |
| `versao-patch` | `string` | **Obrigatório**. Quando corrigir falhas mantendo compatibilidade |
| `versao-patch-sufixo` | `string` | Sufixo do build (beta, rc) |
| `docker_username` | `string` | **Obrigatório**. Usuário para autenticação do Docker Hub |
| `docker_token` | `string` | **Obrigatório**. Token para autenticação do Docker Hub |