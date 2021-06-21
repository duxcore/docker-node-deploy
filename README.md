# docker-node-deploy

### Deploy a container

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
      "basePath": "CONTAINER_BASE_PATH",
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
    "id": "CONTAINER_ID",
    "startTime": CONTAINER_START_TIME
  }
}
```

### Get container details

```http
GET http://localhost:6969/container/CONTAINER_ID
```

Returns:

```json
{
  "success": true,
  "container": {
    "id": "CONTAINER_ID",
    "url": "GIT_REPO_URL",
    "branch": "REPO_BRANCH",
    "path": "CONTAINER_PATH",
    "startTime": CONTAINER_START_TIME
  }
}
```

### Stop a container

```http
POST http://localhost:6969/CONTAINER_ID/stop
```

### Start a container

```http
POST http://localhost:6969/CONTAINER_ID/start
```

### Build a container

```http
POST http://localhost:6969/CONTAINER_ID/build
```

### Pull git latest for a container

```http
POST http://localhost:6969/CONTAINER_ID/pull
```

### Delete a container

```http
POST http://localhost:6969/CONTAINER_ID/delete
```

Returns:

```json
{ "success": boolean}
```
