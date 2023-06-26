pipeline {

    agent {
        docker {
            image '10.50.8.188/devops/node:16.17-alpine3.15-pkg'
            args '-u root'
            args '-v /root/.ssh/id_rsa:/tmp/sshkey'
            // jenkins服务器的id_rsa挂载到容器中，作为免密操作nginx服务器
        }
    }

    environment {
        // gitlab远程源,一般是origin,除非指定
        //head="origin"
        // 分支hash值,将命令的运行结果赋值给变量
        //def hash = sh(script: "git rev-parse --short HEAD" , returnStdout:true).trim()
        // 前端服务器地址
        // dev前端服务器
        host_dev="root@10.50.8.83"
        // sit前端服务器
        host_sit="root@10.50.120.147"
        // uat前端服务器
        host_uat_1="root@10.250.33.125"
        host_uat_2="root@10.250.33.71"
        ssh_port="22022"
        // prod前端服务器
        // host_prod="root@xxx"
    }

   stages {

        stage("Build"){
            steps {
                echo "====== node打包 ======"
                sh """
                    echo "工作目录: ${WORKSPACE}"
                    echo "项目名称: ${JOB_BASE_NAME}"
                    echo "分支名称: ${params.branch}"

                    echo "前端打dist包"
                    ls -l
                    npm install --registry https://registry.npm.taobao.org
                    npm run build
                    ls -l
                """
            }
        }
        stage("Deploy"){

            // 当指定的Groovy表达式求值为true时执行阶段，例如: when { expression { return params.DEBUG_BUILD } }
            when {
                expression { return params.is_deploy }
            }
            steps {
                echo "====== 更新部署到内部环境 ======"
                sh """
                    echo "项目名称: ${JOB_BASE_NAME}"
                    echo "分支名称: ${params.branch}"
                    echo "部署环境: ${params.deploy_env}"
                """

                // 先在jenkins服务器上配置ssh免密登陆前端服务器
                // if 和 when 都是用来做判断的，但是if所在的位置和when不同，if需要在stage中定义script后，在script中使用
                script {

                    if(params.deploy_env == "dev") {
                        sh """
                            echo "拷贝dist到${params.deploy_env}环境前端服务器目录上:"
                            scp  -o "StrictHostKeyChecking no" -i /tmp/sshkey -r dist  ${host_dev}:/usr/local/nginx/html/dev/human
                            echo "热加载nginx服务:"
                            ssh  -o "StrictHostKeyChecking no" -i /tmp/sshkey -t ${host_dev} "/usr/local/nginx/sbin/nginx -s reload ; echo 'nginx 热加载完成'"
                        """
                    }

                    if(params.deploy_env == "test") {
                        sh """
                            echo "拷贝dist到${params.deploy_env}前端服务器目录上:"
                            scp  -o "StrictHostKeyChecking no" -i /tmp/sshkey -r dist  ${host_sit}:/usr/local/nginx/html/test/human
                            echo "热加载nginx服务:"
                            ssh  -o "StrictHostKeyChecking no" -i /tmp/sshkey -t ${host_sit} "/usr/local/nginx/sbin/nginx -s reload ; echo 'nginx 热加载完成'"
                        """
                    }

                    if(params.deploy_env == "uat") {
                        sh """
                            echo "拷贝dist到${params.deploy_env}环境前端服务器目录上:"
                            scp  -o "StrictHostKeyChecking no" -i /tmp/sshkey -P ${ssh_port} -r dist  ${host_uat_1}:/usr/local/nginx/html/uat/human
                            scp  -o "StrictHostKeyChecking no" -i /tmp/sshkey -P ${ssh_port} -r dist  ${host_uat_2}:/usr/local/nginx/html/uat/human
                            echo "热加载nginx服务:"
                            ssh  -o "StrictHostKeyChecking no" -i /tmp/sshkey -p ${ssh_port} -t ${host_uat_1} "/usr/local/nginx/sbin/nginx -s reload ; echo 'nginx 热加载完成'"
                            ssh  -o "StrictHostKeyChecking no" -i /tmp/sshkey -p ${ssh_port} -t ${host_uat_2} "/usr/local/nginx/sbin/nginx -s reload ; echo 'nginx 热加载完成'"
                        """
                    }

                    if(params.deploy_env == "prod") {
                        sh """
                            echo "拷贝dist到${params.deploy_env}环境前端服务器目录上:"
                            scp  -o "StrictHostKeyChecking no" -i /tmp/sshkey -r dist  ${host_prod}:/usr/local/nginx/html/prod/human
                            echo "热加载nginx服务:"
                            ssh  -o "StrictHostKeyChecking no" -i /tmp/sshkey -t ${host_prod} "/usr/local/nginx/sbin/nginx -s reload ; echo 'nginx 热加载完成'"
                        """
                    }

                }
            }
        }
    }
}
