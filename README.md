# Actions TLV7
Github actions TLV7, concentra todas as actions responsaveis por realizar builds, deploys e subidas de aplicações.

## build-docker

#### Action build-docker faz a criação de imagens Docker a partir de um Dockerfile, criação da tag da imagem Docker e também envia a imagem para um repositório.

```Action
   novacia/actions/build-docker@main
```
**Observação:** antes da chamada da action build-docker, deve ser chamada a action de checkout

**Exemplo:**
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
| `latest` | `boolean` | Informa se a versão a ser gerada é latest (Produção) **Default: false** |
| `docker_username` | `string` | **Obrigatório**. Usuário para autenticação do Docker Hub |
| `docker_token` | `string` | **Obrigatório**. Token para autenticação do Docker Hub |

**Exemplo:**

![build-docker](https://i.ibb.co/t8VpJkb/build-docker.png)

## build-assembly

#### Action build-assembly realiza o build dos projetos e suas dependências, também o empacotamento dos códigos para o Nuget e faz a sua publicação.

```Action
   novacia/actions/build-assembly@main
```

**Observação:** antes da chamada da action build-api, deve ser chamada a action de checkout

**Exemplo:**
```Checkout
    actions/checkout@v3
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `versao-major` | `string` | **Obrigatório**. Quando fizer mudanças incompatíveis na API |
| `versao-minor` | `string` | **Obrigatório**. Quando adicionar funcionalidades mantendo compatibilidade |
| `versao-patch` | `string` | **Obrigatório**. Quando corrigir falhas mantendo compatibilidade |
| `versao-patch-sufixo` | `string` | Sufixo do build (beta, rc) |
| `config` | `string` | **Obrigatório**. Tipo de build (Beta, Rc, Release) |
| `csproj` | `string` | **Obrigatório**. Arquivo de Build Microsoft |
| `nupkg` | `string` | **Obrigatório**. Path pacote nuget |
| `username` | `string` | **Obrigatório**. Username Nuget |
| `token` | `string` | **Obrigatório**. Token Nuget |

**Exemplo:**

![build-assembly](https://i.ibb.co/sgGVRyq/build-assembly.png)

## deploy

#### Action deploy derruba a stack e sobe novamente para carregar as modificações realizada nas aplicações

```Action
   novacia/actions/deploy@main
```

| Parâmetro   | Tipo       | Descrição                           | Obrigatório             |
| :---------- | :--------- | :---------------------------------- | :---------------------- |
| `host` | `string` | Host Server | Sim |
| `port` | `string` | Port SSH - Valor default: 22 | Sim |
| `username` | `string` | Username SSH | Sim |
| `password` | `string` | Password SSH | Sim |
| `key` | `string` | Private Key SSH | Sim |
| `stack` | `string` | Nome da Stack | Sim |
| `config` | `string` | Tipo de build (Beta, Rc, Release) | Não |
| `versao-major` | `string` | Quando fizer mudanças incompatíveis na API | Sim |
| `versao-minor` | `string` | Quando adicionar funcionalidades mantendo compatibilidade | Sim |
| `versao-patch` | `string` | Quando corrigir falhas mantendo compatibilidade | Sim |
| `versao-patch-sufixo` | `string` | Sufixo do build (beta, rc) | Não |
| `latest` | `boolean` | Informa se a versão a ser gerada é latest (Produção) **Default: false** | Não |

**Exemplo:**

![build-assembly](https://i.ibb.co/HGBHsw5/deploy.png)