# docker-node-deploy

### Deploy a environment

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

### Stop a environment

```http
POST http://localhost:6969/stop
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
