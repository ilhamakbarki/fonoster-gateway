pipeline {
    triggers {
        pollSCM('H/5 * * * *')
    }
    agent { label (env.BRANCH_NAME == 'staging_beta' ? 'agent-staging' : 'agent-production') }
    environment {
        REGISTRY_HOST = credentials("DOCKER_REGISTRY_HOST")
        REGISTRY_USER = "DOCKER_REGISTRY_USER"
        STAGING_HOST = credentials('HOST_STAGING')
        STAGING_USER = "USER_SERVER_STAGING"
        DOCKER_IMAGE = "svc_fonoster_gateway"
        COMPOSE_FILE = "/home/ubuntu/apps/fonoster/docker-compose.yaml"
        APPROVAL = credentials("APPROVAL_RELEASE")
        AWS_SCRIPT = credentials("AWS_AUTO_START_SCRIPT")
        CONFIG_PROD_AWS = credentials("FONOSTER_API_PROD_AWS_CONFIG")
        NOTIF_API_KEY = credentials('NOTIF_API_KEY')
    }
    stages {
        stage('Build & Push Image Staging & Remove Image') {
            when { branch 'staging_beta' }
            steps {
                script{
                    echo 'Start Build Image Staging'
                    sh 'docker build -t ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-latest -f docker/Dockerfile .'

                    echo 'Start Pushing Image'
                    docker.withRegistry('https://${REGISTRY_HOST}', REGISTRY_USER) {
                        sh 'docker push ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-latest'
                        sh 'docker tag ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-latest ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-${BUILD_NUMBER}'
                        sh 'docker push ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-${BUILD_NUMBER}'
                    }

                    echo "Removing image after push"
                    sh "docker rmi -f ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-latest"
                    sh "docker rmi -f ${REGISTRY_HOST}/${DOCKER_IMAGE}:${BRANCH_NAME}-${BUILD_NUMBER}"
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
        stage('Build & Push Image Production & Remove Image') {
            when { tag "release-*" }
            steps {
                script{
                    echo 'Start Build Image Production'
                    sh 'docker build -t ${REGISTRY_HOST}/${DOCKER_IMAGE}:release-latest -f docker/Dockerfile .'

                    echo 'Start Pushing Image'
                    docker.withRegistry('https://${REGISTRY_HOST}', REGISTRY_USER) {
                        sh 'docker push ${REGISTRY_HOST}/${DOCKER_IMAGE}:release-latest'
                        sh 'docker tag ${REGISTRY_HOST}/${DOCKER_IMAGE}:release-latest ${REGISTRY_HOST}/${DOCKER_IMAGE}:${TAG_NAME}-${BUILD_NUMBER}'
                        sh 'docker push ${REGISTRY_HOST}/${DOCKER_IMAGE}:${TAG_NAME}-${BUILD_NUMBER}'
                    }

                    echo "Removing image after push"
                    sh "docker rmi -f ${REGISTRY_HOST}/${DOCKER_IMAGE}:release-latest"
                    sh "docker rmi -f ${REGISTRY_HOST}/${DOCKER_IMAGE}:${TAG_NAME}-${BUILD_NUMBER}"
                }
            }
        }
        stage('Clean Up Docker Images & Cache') {
            steps {
                script {
                    echo "Cleaning up Docker images and build cache"
                    sh "docker image prune -f"
                    sh "docker builder prune -f"
                    echo "Clean up completed!"
                }
            }
        }
        stage('Deploy on Staging') {
            when { branch 'staging_beta' }
            steps {
                echo 'Start Deploy on Staging'
                script {
                    sshagent(credentials: [STAGING_USER]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${STAGING_HOST} ' 
                            docker compose -f ${COMPOSE_FILE} pull ${DOCKER_IMAGE} &&
                            docker compose -f ${COMPOSE_FILE} up -d ${DOCKER_IMAGE}'
                        """
                    }
                }
            }
        }
        stage('Deploy on Production') {
            when { tag "release-*" }
            steps {
                echo 'Starting Deploy on Production'
                script {
                    sh '${AWS_SCRIPT} ${CONFIG_PROD_AWS}'
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
    sh """
        curl --location 'https://webhooks.socialbot.dev/webhook/jenkins-deploy' \\
            --header 'Content-Type: application/json' \\
            --header 'x-api-key: ${NOTIF_API_KEY}' \\
            --data '{
                "message": "${message}",
                "service": "${DOCKER_IMAGE}",
                "branch": "${branch}",
                "tag": "${tag}"
            }'
    """
}
