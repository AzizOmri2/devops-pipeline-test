# Deployment Instructions

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Application Architecture](#application-architecture)
4. [Setup Instructions](#setup-instructions)
   - [Step 1: Clone the Repository](#step-1-clone-the-repository)
   - [Step 2: Environment Configuration](#step-2-environment-configuration)
   - [Step 3: Containerize the Application](#step-3-containerize-the-application)
   - [Step 4: Deploy with Docker Compose](#step-4-deploy-with-docker-compose)
   - [Step 5: Set Up CI/CD Pipeline](#step-5-set-up-ci-cd-pipeline)
5. [Usage Instructions](#usage-instructions)
6. [Troubleshooting](#troubleshooting)

---

## Project Overview
This project is a full-stack application focused on managing projects. It consists of the following components:
- **Frontend**: Built with [Angular].
- **Backend**: Developed using [Spring Boot].
- **Database**: Powered by [MySQL].

The deployment process uses Docker to containerize components and Docker Compose for orchestration. A CI/CD pipeline automates building, testing, and deploying the application.

---

## Prerequisites
Ensure you have the following installed:
- **Git**: Version control system.
- **Docker**: For containerization.
- **Docker Compose**: For orchestrating containers.
- **Jenkins**: For setting up the CI/CD pipeline.
- **Maven**: For managing project dependencies and building Java applications.

---

## Application Architecture
```plaintext
Frontend: [Port 4200]
Backend: [Port 8089]
Database: [Port 3306]
```
The architecture ensures scalability and fault tolerance with containerized services and automated pipelines.

---

## Setup Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/AzizOmri2/devops-pipeline-test.git
cd devops-pipeline-test
```

### Step 2: Environment Configuration
Configure environment variables of the Backend project (Spring Boot) in application.properties file.
```plaintext
spring.application.name=backoffice
server.port=8089
server.servlet.context-path=/testdevops

# Database connection settings
spring.datasource.url=jdbc:mysql://mysqldb:3306/testdevops?createDatabaseIfNotExist=true&useUnicode=true
spring.datasource.username=root
spring.datasource.password=root

# JPA settings
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```
Ensure that you change the variables spring.datasource.url `localhost` by `mysql container's name`, spring.datasource.username by `root` and spring.datasource.password by `root` too.

### Step 3: Containerize the Application
Ensure each component has a `Dockerfile`. Example `Dockerfile` for the backend:
```Dockerfile
FROM openjdk:17-jdk-alpine
COPY target/*.jar /
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/backend-0.0.1.jar"]
```
Build images:
```bash
docker build -t springback-testdevops:latest -f backend/Dockerfile ./backend
docker build -t angularfront-testdevops:latest -f frontend/Dockerfile ./frontend
```

### Step 4: Deploy with Docker Compose
Create a `docker-compose.yml` file to orchestrate containers:
```yaml
version: '3.8'

services:
  mysqldb:
    image: mysql:latest
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=testdevops
    ports:
      - 3306:3306
    volumes:
      - db:/var/lib/mysql
    networks:
      - app-network


  app-spring:
    depends_on:
      - mysqldb
    image: azizomri/springback-testdevops:latest
    restart: on-failure
    ports:
      - 8089:8089
    environment:
      SPRING_APPLICATION_JSON: '{
        "spring.datasource.url" : "jdbc:mysql://mysqldb:3306/testdevops?createDatabaseIfNotExist=true",
        "spring.datasource.username" : "root",
        "spring.datasource.password" : "root",
        "spring.jpa.properties.hibernate.dialect" : "org.hibernate.dialect.MySQL8Dialect",
        "spring.jpa.hibernate.ddl-auto" : "update"
      }'
    stdin_open: true
    tty: true
    networks:
      - app-network

  app-angular:
    depends_on:
      - app-spring
    image: azizomri/angularfront-testdevops:latest
    restart: on-failure
    ports:
      - 4200:80
    networks:
      - app-network  

volumes:
  db:

networks:
  app-network:
    driver: bridge
```
Start the services:
```bash
docker-compose up -d
```

### Step 5: Set Up CI/CD Pipeline
1. **Pipeline Configuration**: Use Jenkins for the pipeline.
2. **Example Jenkins Pipeline**:
   ```groovy
   pipeline {
    agent any

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/AzizOmri2/devops-pipeline-test.git',
                credentialsId: 'PAT_Jenkins'
            }
        }
        
        stage('Testing Maven') {
            steps{
                sh 'mvn -f backend/pom.xml clean install'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build Spring Docker Image from the specified Dockerfile
                    sh 'mvn -f backend/pom.xml clean install'
                    sh 'docker build -t springback-testdevops:latest -f backend/Dockerfile ./backend'
                    
                    // Build Angular Docker Image from the specified Dockerfile
                    sh 'docker build -t angularfront-testdevops:latest -f frontend/Dockerfile ./frontend'
                }
            }
        }
        
        stage('Pushing to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    sh """ echo ${DOCKER_HUB_PASSWORD} | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin """
                    
                    sh "docker tag springback-testdevops:latest azizomri/springback-testdevops:latest"
                    sh "docker push azizomri/springback-testdevops:latest"
                    
                    sh "docker tag angularfront-testdevops:latest azizomri/angularfront-testdevops:latest"
                    sh "docker push azizomri/angularfront-testdevops:latest"
                }
            }
        }
        
        stage('Running docker compose') {
            steps {
                sh 'docker compose up -d'
            }
        }
        
    }
    
    
   }

   ```
You have to set your credentials if you need any access to an external accounts. In this case we need to set credentials for github (in case your repository is private) and dockerHub to push docker images.
---

## Usage Instructions
Access the application:
- **Frontend**: `http://localhost:8089`
- **Backend**: `http://localhost:4200`

---

## Troubleshooting
- Check container logs:
  ```bash
  docker logs [container_name]
  ```
- Restart services:
  ```bash
  docker-compose restart
  ```
- Verify environment variables are correctly configured.

---
