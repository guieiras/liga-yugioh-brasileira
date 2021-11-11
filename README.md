# Liga Yu-Gi-Oh! Brasileira

Brazilian Yu-Gi-Oh! League is a project made by PRRJCARDS and TCG Network with the aim of creating a competitive Brazilian community.

This system records players performances and match-ups through all seasons and series.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software

- [Node.JS](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/)
- [Yarn 2+](https://yarnpkg.com/)
- [Auth0 Account](https://auth0.com)

### Installing

This will help you to get a development env running

- Copy environment variables template

```
cp .env.sample .env.local
```

- Change the following environment variables

  - `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET` and `AUTH0_DOMAIN` from Auth0 Dashboard
  - `DATABASE_URL` with the PostgreSQL connection URL
  - `DATABASE_SKIP_SSL` use "true" if your database does not accept SSL connection (in development, for example). Remove it, otherwise (*recommended for production)


- Install dependencies

```
yarn install
```

- Start development server

```
yarn dev
```

## Contributing

Feel free to open issues and PRs. I'll try to review as soon as I can.

## Built With

* [NextJS](https://nextjs.org/) - Full-Stack framework
* [MUI](https://mui.com/) - User Interface

## Authors

* **[Guilherme Eiras](https://github.com/guieiras)** - *Concept and initial work*
