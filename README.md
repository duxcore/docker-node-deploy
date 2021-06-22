# docker-node-deploy

A [node.js](https://nodejs.org/) based deployment server that allows you to deploy and manage your [docker containers](https://www.docker.com/)

### Running it locally
- Clone this repo
- Install it's dependencies by running `yarn` in the root of the project
- Build the deployment server using `yarn build`
- Make sure to set environment variables in `.env` *(example can be found in [`.env.example`](https://github.com/duxcore/docker-node-deploy/blob/main/.env.example))*
- Run the deployment server using `yarn start`

### Methods
#### Deploy an environment

```http
POST http://localhost:6969/deploy
```

Payload:

```json
{
  "url": "GIT_REPO_URL",
  "branch": "REPO_BRANCH",
  "envName": "ENVIRONMENT_NAME",
  "containers": [
    {
      "dir": "CONTAINER_DIRECTORY",
      "envVars": [
        {
          "key": "ENV_VAR_KEY",
          "value": "ENV_VAR_VALUE"
        }
      ]
    }
  ]
}
```

Returns:

```json
{
  "success": true,
  "data": {
    "name": "ENVIRONMENT_NAME"
  }
}
```

#### Terminate an environment

```http
POST http://localhost:6969/terminate
```

Payload:

```json
{
  "envName": "ENVIRONMENT_NAME"
}
```

Returns:

```json
{
  "success": true,
  "data": {
    "name": "ENVIRONMENT_NAME"
  }
}
```

## Maintainers
- [@amitojsingh366](https://github.com/amitojsingh366)

## License
docker-node-deploy is licensed under the MIT License

## Contributing
Find something that is lacking? Fork the project and pull request!