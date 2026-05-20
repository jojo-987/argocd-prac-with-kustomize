pipeline {
    agent { label 'Interns_2026_Win_agent' }
    
    stages{
        stage("checkout"){
            steps{
                bat 'checkout'
            }
        }
        stage("sonar-scan"){
            steps{
                bat 'sonar scan...'
            }
        }
        stage("installing-deps"){
            steps{
            bat 'installing deps...'
            }
        }
        Stage("owasp-deps-check"){
            steps {
            bat 'owasp check...'
            }
        }
        stage("file-scan-trivy"){
            steps {
                bat 'file scan...'
            }
        }
        stage("building-image"){
            steps {
                bat 'building image...'
            }
        }
        stage("upload-to-docker-registry"){
            steps{
                bat 'uploading to docker registry...'
            }
        }
        stage("image-scan-trivy"){
            steps{
                bat 'image scanning...'
            }
        }
        stage("updating-yaml-manifests-github"){
            steps {
            bat 'update yaml manifest..'
            }
        }
    }
}
