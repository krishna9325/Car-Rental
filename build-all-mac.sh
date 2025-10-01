#!/usr/bin/env bash
set -e

echo "=== Building all microservices using Gradle wrappers ==="

folders=("eureka-server" "api-gateway" "authservice" "carrentalservice" "admin" "userservice")

for folder in "${folders[@]}"; do
    echo "Building JAR for $folder..."
    (cd Backend/$folder && ./gradlew bootJar)
done

echo "=== Building Docker images for backend microservices ==="
services=("eureka-server" "api-gateway" "authservice" "carrentalservice" "admin" "userservice")
for service in "${services[@]}"; do
    docker-compose build $service
done

echo "=== Building Frontend ==="
docker-compose build --build-arg REACT_APP_API_BASE_URL=http://api-gateway:8080 frontend

echo "=== Starting all containers ==="
docker-compose up -d

echo "=== All services are up! ==="

