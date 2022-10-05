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

| Parâmetro   | Tipo       | Descrição                           | Obrigatório             |
| :---------- | :--------- | :---------------------------------- | :---------------------- |
| `hub` | `string` | Junção do Repositório no Docker Hub + Nome do Projeto | Sim |
| `projeto` | `string` | Nome do projeto no Repositório | Sim |
| `config` | `string` | Tipo de build (Beta, Rc, Release) | Sim |
| `versao-major` | `string` | Quando fizer mudanças incompatíveis na API | Sim |
| `versao-minor` | `string` | Quando adicionar funcionalidades mantendo compatibilidade | Sim |
| `versao-patch` | `string` | Quando corrigir falhas mantendo compatibilidade | Sim |
| `versao-patch-sufixo` | `string` | Sufixo do build (beta, rc) | Não |
| `latest` | `boolean` | Informa se a versão a ser gerada é latest (Produção) **Default: false** | Não |
| `docker_username` | `string` | Usuário para autenticação do Docker Hub | Sim |
| `docker_token` | `string` | Token para autenticação do Docker Hub | Sim |

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

| Parâmetro   | Tipo       | Descrição                           | Obrigatório             |
| :---------- | :--------- | :---------------------------------- | :---------------------- |
| `versao-major` | `string` | Quando fizer mudanças incompatíveis na API | Sim |
| `versao-minor` | `string` | Quando adicionar funcionalidades mantendo compatibilidade | Sim |
| `versao-patch` | `string` | Quando corrigir falhas mantendo compatibilidade | Sim |
| `versao-patch-sufixo` | `string` | Sufixo do build (beta, rc) | Não |
| `config` | `string` | Tipo de build (Beta, Rc, Release) | Sim |
| `csproj` | `string` | Arquivo de Build Microsoft | Sim |
| `nupkg` | `string` | Path pacote nuget | Sim |
| `username` | `string` | Username Nuget | Sim |
| `token` | `string` | Token Nuget | Sim |

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