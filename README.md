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

## pipeline

#### Action pipeline faz a criação, edição e remove os arquivo de pipeline das aplicações Tlv7

```Action
   novacia/actions/pipeline@main
```

**Observação:** antes da chamada da action pipeline, deve ser chamada a action de checkout

**Exemplo:**
```Checkout
    actions/checkout@v3
```

| Parâmetro   | Tipo       | Descrição                           | Obrigatório             |
| :---------- | :--------- | :---------------------------------- | :---------------------- |
| `host` | `string` | Host Server | Sim |
| `port` | `string` | Port SSH - Valor default: 22 | Sim |
| `username` | `string` | Username SSH | Sim |
| `password` | `string` | Password SSH | Sim |
| `key` | `string` | Private Key SSH | Sim |
| `github_token` | `string` | Secret gerada automaticamente ao ser trigado um Evento de Push | Sim |

**Exemplo:**

![pipeline](https://i.ibb.co/nwpcT6S/pipeline.png)

## gerar-versionamento

#### Action gerar-versionamento faz o controle de incremento da versão minor para geração de build das aplicações Tlv7

```Action
   novacia/actions/gerar-versionamento@main
```

| Parâmetro   | Tipo       | Descrição                           | Obrigatório             |
| :---------- | :--------- | :---------------------------------- | :---------------------- |
| `code` | `string` | Host Server | Sim |
| `token` | `string` | Port SSH - Valor default: 22 | Sim |
| `endpoint` | `string` | Username SSH | Sim |
| `name-package` | `string` | Password SSH | Sim |

```Outputs
   versao_minor
```
**Observação:** para utilizar a variavel de retorno em outro job, deve ser usando o parametro "need", informando o nome do job que está executando o versionamento

**Exemplo:**

![gerar-versionamento](https://i.ibb.co/nwpcT6S/pipeline.png)