# ADASilk

## About

Repository for ADASilk with configuration files for [D2KLab/explorer](https://github.com/D2KLab/explorer).

## Requirements

* [Docker](https://docs.docker.com/engine/)
* [docker-compose](https://docs.docker.com/compose/)

## How to run

- Download this repository:

```bash
git clone https://github.com/silknow/adasilk
cd explorer
```

- Start in development mode:

```bash
docker-composer -f docker-compose.yml -f docker-compose.dev.yml up
```

- Start in production mode:

```bash
docker-composer -f docker-compose.yml -f docker-compose.prod.yml up
```

## License

ADASilk is [Apache licensed](https://github.com/silknow/adasilk/blob/master/LICENSE).
