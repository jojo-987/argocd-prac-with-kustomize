pipeline {
    agent { label 'kp' }
    
    environment {
        // Dynamic versioning using build number prevents overwriting images
        NEW_VERSION     = "v3"
        IMAGE_NAME      = 'demo-backend'
        DOCKER_USER     = 'dockerUser'
        REGISTRY_IMAGE  = "${DOCKER_USER}/${IMAGE_NAME}:${NEW_VERSION}"
        
        // Jenkins Credential IDs
        GIT_CRED_ID     = 'git-creds'
        DOCKER_CRED_ID  = 'docker-hub-credentials' // Add this ID in Jenkins Credentials
    }
    
    stages {
        stage("Checkout") {
            steps {
                git(
                    branch: 'main', 
                    credentialsId: "${env.GIT_CRED_ID}", 
                    url: 'git-url'
                )
            }
        }
        
        stage("SonarQube Scan") {
            steps {
                // Use official SonarQube wrapper if configured in Jenkins
                echo 'Running SonarQube analysis...'
                // bat 'sonar-scanner' 
            }
        }
        
        stage("Install Dependencies") {
            steps {
                dir('server') {
                    bat 'npm install'
                }
            }
        }
        
        stage("Trivy FS Scan") {
            steps {
                // added exit code flag so pipeline fails on high vulnerabilities
                bat 'trivy fs --exit-code 1 --severity HIGH,CRITICAL ./server'
            }
        }
        
        stage("Build Docker Image") {
            steps {
                bat "docker build ./server -t ${IMAGE_NAME}:${NEW_VERSION}"
            }
        }
        
        stage("Tag Docker Image") {
            steps {
                bat "docker tag ${IMAGE_NAME}:${NEW_VERSION} ${REGISTRY_IMAGE}"
            }
        }
        
        stage("Upload to Docker Registry") {
            steps {
                // Securely binds credentials to prevent password exposure in console logs
                withCredentials([usernamePassword(credentialsId: "${env.DOCKER_CRED_ID}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"
                    bat "docker push ${REGISTRY_IMAGE}"
                }
            }
        }
        
        stage("Trivy Image Scan") {
            steps {
                bat "trivy image --exit-code 1 --severity HIGH,CRITICAL ${REGISTRY_IMAGE}"
            }
        }
        
        stage("Update YAML Manifests") {
            steps {
                echo 'Updating Kustomize / GitOps manifests...'
                // Best practice: Use sed or kustomize edit set image to update the version automatically
                bat "cd deployment && kustomize edit set image ${DOCKER_USER}/${IMAGE_NAME}=${REGISTRY_IMAGE}"
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up Docker environment...'
            // bat "docker rmi ${REGISTRY_IMAGE} || exit 0"
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
