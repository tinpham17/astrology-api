# Astrology API

## Run locally

- Run Postgres in Docker:

```
docker run --name astrology-postgres -p 5432:5432 -e POSTGRES_USER=postgres-user -e POSTGRES_PASSWORD=postgres-pw -e POSTGRES_DB=astrology-db -d postgres
```

- Run server:

```
npm run dev
```

## Run in production

```
npm run build
npm start
```

## Dockerize

```
docker-compose up --build
```