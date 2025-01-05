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
        
        /*stage('SonarQube Analysis') {
            steps{
                withSonarQubeEnv('sonar') {
                    sh 'mvn -f backend/pom.xml org.sonarsource.scanner.maven:sonar-maven-plugin:4.0.0.4121:sonar -Dsonar.host.url=http://203.0.113.32:9000'
                }
            }
        }*/
        
        
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
                    //sh "docker login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}"
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
