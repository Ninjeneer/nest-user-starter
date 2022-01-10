<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
<h1 align="center">NestJS Starter-Kit</h1>


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with user management and role based authorizations

## Installation

```bash
$ npm install
```

## Configuration
### Server
Copy the `src/assets/config-template.json` file as `src/assets/config.json`
```bash
$ cp src/assets/config-template.json src/assets/config.json
```
Feel free to edit settings to match your environment requirements


### Database

Copy the `prisma/.env.template` file as `prisma/.env`
```bash
$ cp prisma/.env.template prisma/.env
```
Feel free to edit settings to match your environment requirements

## Push database schema

```bash
$ npx prisma db push
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# all tests
$ npm run mocha

# e2e tests
$ npm run mocha:e2e

# test coverage
$ npm run mocha:cov
```

## Internal Dependency Graph

Green = **Core** modules

Blue = **API** modules

![Dependency graph](doc/dependency_graph.png)

## License

Nest is [MIT licensed](LICENSE).
