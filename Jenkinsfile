pipeline {
    agent {
        kubernetes {
          label 'kube-1'
        }
    }
    environment {
        REGISTRY_HOST = credentials("DOCKER_REGISTRY_HOST")
        DOCKER_IMAGE = "svc_fonoster_gateway"
        APPROVAL = credentials("APPROVAL_RELEASE")
        NOTIF_API_KEY = credentials('NOTIF_API_KEY')
    }
    stages {
        stage('Build & Push Image Staging & Deploy on Staging') {
            when { branch 'staging_beta' }
            steps {
                script{
                    echo 'Start Build Image Staging'
                    sh "docker build -t ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-latest -f docker/Dockerfile ."

                    echo 'Start Pushing Image'
                    docker.withRegistry("https://${REGISTRY_HOST}", 'DOCKER_REGISTRY_USER') {
                        sh "docker push ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-latest"
                        sh "docker tag ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-latest ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-${BUILD_NUMBER}"
                        sh "docker push ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-${BUILD_NUMBER}"
                    }

                    echo 'Start Deploy on Staging'
                    sh "kubectl set image deployment fonoster-app fonoster-app=${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-${BUILD_NUMBER} -n=fonostergateway-staging"
                }
            }
        }
        stage('Publish Approval') {
            when { tag "release-*" }
            steps {
                script{
                    def tagName = env.TAG_NAME
                    def approvers = APPROVAL.split(',')
                    def userName = input message: "Do you want to deploy ${tagName}?", submitter: APPROVAL, submitterParameter: "userName"
                    
                    if (!approvers.contains(userName)) {
                        error('This user is not approved to deploy to PROD.')
                    } else {
                        echo "Accepted by ${userName}"
                    }
                }
            }
        }
        stage('Build & Push Image Production & Deploy on Production') {
            when { tag "release-*" }
            steps {
                script{
                    echo 'Start Build Image Production'
                    sh "docker build -t ${REGISTRY_HOST}/${DOCKER_IMAGE}:release-latest -f docker/Dockerfile ."

                    echo 'Start Pushing Image'
                    docker.withRegistry("https://${REGISTRY_HOST}", 'DOCKER_REGISTRY_USER') {
                        sh "docker push ${REGISTRY_HOST}/${DOCKER_IMAGE}:release-latest"
                        sh "docker tag ${REGISTRY_HOST}/${DOCKER_IMAGE}:release-latest ${REGISTRY_HOST}/${DOCKER_IMAGE}:${TAG_NAME}-${BUILD_NUMBER}"
                        sh "docker push ${REGISTRY_HOST}/${DOCKER_IMAGE}:${TAG_NAME}-${BUILD_NUMBER}"
                    }

                    echo 'Start Deploy on Production'
                    sh "kubectl set image deployment fonoster-app fonoster-app=${REGISTRY_HOST}/${DOCKER_IMAGE}:${TAG_NAME}-${BUILD_NUMBER} -n=fonostergateway-production"
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy Success...'
            script {
                sendNotification("Success to deploy")
            }
        }
        failure {
            echo 'Deploy Failed.'
            script {
                sendNotification("Failed to deploy")
            }
        }
    }
}

def sendNotification(message) {
    echo 'Sending Notification...'
    def tag = env.TAG_NAME ?: ''
    def branch = env.BRANCH_NAME ?: ''
    def NAME = env.TAG_NAME ?: env.BRANCH_NAME
    def cleanJobPath = env.JOB_NAME.replaceFirst('^/job', '').replaceAll('/$', '')
    def formattedJobPath = cleanJobPath.split('/').collect { "job/${it}" }.join('/')
    def link = "${env.PUBLIC_JENKINS_URL}${formattedJobPath}/${env.BUILD_NUMBER}/console"
    sh """
        curl --location 'https://webhooks.socialbot.dev/webhook/jenkins-deploy' \\
            --header 'Content-Type: application/json' \\
            --header 'x-api-key: ${NOTIF_API_KEY}' \\
            --data '{
                "message": "${message} Link : ${link}",
                "service": "${DOCKER_IMAGE}",
                "branch": "${branch}",
                "tag": "${tag}"
            }'
    """
}
