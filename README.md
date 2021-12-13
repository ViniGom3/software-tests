# Teste de Software 👨‍🔬🧪

## Getting Start 🚀

Comece instalando as dependências com o npm:

```shell
$ npm install
```

Isso irá instalar as dependências e dependências de desenvolvimento.

Depois disso, com o Docker e o docker-compose instalado, rode:

```shell
$ docker-compose up
```

Isso subirá o container do postgres e adicionará um banco.

## Scrips de uso 🤖

Para iniciar a aplicação:

```shell
$ npm run start
```

Para adicionar o _schema_ ao banco:

```shell
$ npx prisma migrate dev --name init
```

Para preencher o banco com dados ficticios 🚧:

```shell
$ npx prisma db seed
```

Para iniciar a aplicação em modo de desenvolvimento:

```shell
$ npm run dev

    # ou

$ npm run watch:debug   # Isso permitirá executar o debugger.
```

Para rodar os testes:

```shell
$ npm run test

    # ou

$ npm run test:watch    # Isso manterá os testes executando.

    # ou

$ npm run test:integration    # Recomendado! Pois irá rodar os testes sequencialmente.
```
