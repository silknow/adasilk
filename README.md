# ADASilk

## About

The SILKNOW Exploratory Search Engine is named after Ada Lovelace (1815-1852), the mathematician that anticipated some of the main features of modern computing some 100 years before its advent. In her notes, she wrote that such a computation machine *
weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves*.

## Requirements

* [Docker](https://docs.docker.com/engine/)
* [docker-compose](https://docs.docker.com/compose/)

## How to run

- Download this repository:

```bash
git clone https://github.com/silknow/adasilk
cd explorer
```

- Copy the file `.env.default` into a new file called `.env` and edit the variables based on your environment.

- Start in development mode:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

- Start in production mode:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## License

ADASilk is [Apache licensed](https://github.com/silknow/adasilk/blob/main/LICENSE).
