# Topcoder - Member Processor 

## Dependencies

- nodejs https://nodejs.org/en/ (v8+)
- Kafka
- ElasticSearch v6
- Docker, Docker Compose

## Configuration

Configuration for the notification server is at `config/default.js`.
The following parameters can be set in config files or in env variables:
- DISABLE_LOGGING: whether to disable loggin
- LOG_LEVEL: the log level; default value: 'debug'
- KAFKA_URL: comma separated Kafka hosts; default value: 'localhost:9092'
- KAFKA_CLIENT_CERT: Kafka connection certificate, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to certificate file or certificate content
- KAFKA_CLIENT_CERT_KEY: Kafka connection private key, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to private key file or private key content
- CREATE_PROFILE_TOPIC: create profile Kafka topic, default value is 'member.action.profile.create'
- UPDATE_PROFILE_TOPIC: update profile Kafka topic, default value is 'member.action.profile.update'
- DELETE_PROFILE_TOPIC: delete profile Kafka topic, default value is 'member.action.profile.delete'
- CREATE_TRAIT_TOPIC: create trait Kafka topic, default value is 'member.action.profile.trait.create'
- UPDATE_TRAIT_TOPIC: update trait Kafka topic, default value is 'member.action.profile.trait.update'
- DELETE_TRAIT_TOPIC: delete trait Kafka topic, default value is 'member.action.profile.trait.delete'
- CREATE_PHOTO_TOPIC: create photo Kafka topic, default value is 'member.action.profile.photo.create'
- UPDATE_PHOTO_TOPIC: update photo Kafka topic, default value is 'member.action.profile.photo.update'
- esConfig: ElasticSearch config

Refer to `esConfig` variable in `config/default.js` for ES related configuration.
Usually, you need to configure the ES_HOST environment variable according to setup ES, e.g.
export ES_HOST=localhost:9200


Also note that there is a `/health` endpoint that checks for the health of the app. This sets up an expressjs server and listens on the environment variable `PORT`. It's not part of the configuration file and needs to be passed as an environment variable

## Local Kafka setup

- `http://kafka.apache.org/quickstart` contains details to setup and manage Kafka server,
  below provides details to setup Kafka server in Mac, Windows will use bat commands in bin/windows instead
- download kafka at `https://www.apache.org/dyn/closer.cgi?path=/kafka/1.1.0/kafka_2.11-1.1.0.tgz`
- extract out the doanlowded tgz file
- go to extracted directory kafka_2.11-0.11.0.1
- start ZooKeeper server:
  `bin/zookeeper-server-start.sh config/zookeeper.properties`
- use another terminal, go to same directory, start the Kafka server:
  `bin/kafka-server-start.sh config/server.properties`
- note that the zookeeper server is at localhost:2181, and Kafka server is at localhost:9092
- use another terminal, go to same directory, create some topics:
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic member.action.profile.create`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic member.action.profile.update`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic member.action.profile.delete`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic member.action.profile.trait.create`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic member.action.profile.trait.update`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic member.action.profile.trait.delete`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic member.action.profile.photo.create`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic member.action.profile.photo.update`
- verify that the topics are created:
  `bin/kafka-topics.sh --list --zookeeper localhost:2181`,
  it should list out the created topics
- run the producer and then write some message into the console to send to the `member.action.profile.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic member.action.profile.create`
  in the console, write message, one message per line:
  `{ "topic": "member.action.profile.create", "originator": "member-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "email": "email@test.com", "sex": "male", "created": "2018-01-02T00:00:00", "createdBy": "admin" } }`
- optionally, use another terminal, go to same directory, start a consumer to view the messages:
  `bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic member.action.profile.create --from-beginning`
- writing/reading messages to/from other topics are similar


## ElasticSearch setup

You may download ElasticSearch v6, install and run it locally.
Or to setup ES service using AWS.
Another simple way is to use docker compose:
go to docker-es folder, run `docker-compose up`


## Local deployment

- install dependencies `npm i`
- run code lint check `npm run lint`, running `npm run lint-fix` can fix some lint errors if any
- initialize Elasticsearch, create configured Elasticsearch index if not present: `npm run init-es`
- or to re-create the index: `npm run init-es force`
- run tests `npm run test`
- start processor app `npm start`

## Local Deployment with Docker

To run the Member ES Processor using docker, follow the below steps

1. Navigate to the directory `docker`

2. Rename the file `sample.api.env` to `api.env`

3. Set the required AWS credentials in the file `api.env`

4. Once that is done, run the following command

```
docker-compose up
```

5. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

## Unit tests and Integration tests

Integration tests may use different index `member-test` which may not same as the usual index.

Please ensure to create the index `member-test` or the index specified in the environment variable `ES_INDEX_TEST` before running the Integration tests. You could re-use the existing scripts to create index but you would need to set the below environment variable

```
export ES_INDEX=member-test
```

#### Running unit tests and coverage

To run unit tests alone

```
npm run test
```

To run unit tests with coverage report

```
npm run cov
```

#### Running integration tests and coverage

To run integration tests alone

```
npm run e2e
```

To run integration tests with coverage report

```
npm run cov-e2e
```


## Verification

- start kafka server, start elasticsearch, initialize Elasticsearch, start processor app
- start kafka-console-producer to write messages to `member.action.profile.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic member.action.profile.create`
- write message:
  `{ "topic": "member.action.profile.create", "originator": "member-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "email": "email@test.com", "sex": "male", "created": "2018-02-16T00:00:00", "createdBy": "admin" } }`
- run command `npm run view-data profile1111` to view the created data, you will see the data are properly created:

```bash
info: Elasticsearch data:
info: {
    "userId": 1111,
    "userHandle": "handle",
    "email": "email@test.com",
    "sex": "male",
    "created": "2018-02-16T00:00:00",
    "createdBy": "admin",
    "resource": "profile"
}
```

- you may write invalid message like:
  `{ "topic": "member.action.profile.create", "originator": "member-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "user-id": "1111", "userHandle": "handle", "sex": "male", "created": "2018-01-02T00:00:00", "createdBy": "admin" } }`
- then in the app console, you will see error message

- start kafka-console-producer to write messages to `member.action.profile.update` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic member.action.profile.update`
- write message:
  `{ "topic": "member.action.profile.update", "originator": "member-api", "timestamp": "2018-03-02T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "email": "updated@test.com", "sex": "male", "created": "2018-01-02T00:00:00", "createdBy": "admin", "updated": "2018-03-02T00:00:00", "updatedBy": "admin" } }`
- run command `npm run view-data profile1111` to view the updated data, you will see the data are properly updated:

```bash
info: Elasticsearch data:
info: {
    "userId": 1111,
    "userHandle": "handle",
    "email": "updated@test.com",
    "sex": "male",
    "created": "2018-01-02T00:00:00",
    "createdBy": "admin",
    "resource": "profile",
    "updatedBy": "admin",
    "updated": "2018-03-02T00:00:00"
}
```

- start kafka-console-producer to write messages to `member.action.profile.delete` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic member.action.profile.delete`
- write message:
  `{ "topic": "member.action.profile.delete", "originator": "member-api", "timestamp": "2018-04-16T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle" } }`
- run command `npm run view-data profile1111` to view the deleted data, you will see the data are properly deleted:

```bash
info: The data is not found.
```

- management of other data are similar, below gives valid Kafka messages for other resource types, so that you may test them easily
- create trait:
  `{ "topic": "member.action.profile.trait.create", "originator": "member-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "traitId": 123, "created": "2018-02-16T00:00:00", "createdBy": "admin" } }`
  `{ "topic": "member.action.profile.trait.create", "originator": "member-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "traitId": 456, "created": "2018-02-16T00:00:00", "createdBy": "admin" } }`
- update trait:
  `{ "topic": "member.action.profile.trait.update", "originator": "member-api", "timestamp": "2018-02-17T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "traitId": 123, "created": "2018-02-16T00:00:00", "createdBy": "admin", "updated": "2018-02-17T00:00:00", "updatedBy": "admin" } }`
- delete trait:
  `{ "topic": "member.action.profile.trait.delete", "originator": "member-api", "timestamp": "2018-02-18T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "memberProfileTraitIds": [123, 456] } }`

- create photo:
  `{ "topic": "member.action.profile.photo.create", "originator": "member-api", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "photoURL": "http://test.com/123.png", "created": "2018-02-16T00:00:00", "createdBy": "admin" } }`
- update photo:
  `{ "topic": "member.action.profile.photo.update", "originator": "member-api", "timestamp": "2018-02-17T00:00:00", "mime-type": "application/json", "payload": { "userId": 1111, "userHandle": "handle", "photoURL": "http://test.com/456.png", "created": "2018-02-16T00:00:00", "createdBy": "admin", "updated": "2018-02-16T00:00:00", "updatedBy": "admin" } }`

- to view photo data, run command `npm run view-data profile<userId>photo`, e.g. `npm run view-data profile1111photo`
- to view trait data, run command `npm run view-data profile<userId>trait<traitId>`, e.g. `npm run view-data profile1111trait123`


## Notes
- the processor will add resource field (profile/photo/trait) to the message payload to be indexed in ElasticSearch,
  ('profile' + userId) is used to identify profile,
  ('profile' + userId + 'photo') is used to identify photo,
  ('profile' + userId + 'trait' + traitId) is used to identify trait

