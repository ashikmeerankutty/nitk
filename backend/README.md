# Flask API Boilerplate

## Setup
- Create a `.env` file in the root.

## Enviroment Variables
```
DEBUG=False
DATABASE_URL=mysql+mysqlconnector://username:password@host/db
```

## Docker
Build the docker image
```
docker build -t flask-app:latest .
```

Run the image
```
docker run --name flask-app -d -p 8000:5000 --rm flask-app:latest
```

Stop the process
```
docker stop flask-app
```

### Docker Compose
Run the project
```
docker-compose up
```
