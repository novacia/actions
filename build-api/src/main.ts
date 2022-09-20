import * as core from '@actions/core'
import * as docker from '../../lib/docker'
import * as ssh from '../../lib/ssh'

async function run(): Promise<void> {
    
    try {
        const ssh_host = core.getInput('ssh_host', { required: true })
        const ssh_port = Number(core.getInput('ssh_port', { required: true }))
        const ssh_username = core.getInput('ssh_username', { required: true })
        const ssh_password = core.getInput('ssh_password', { required: true })
        const docker_username = core.getInput('docker_username', { required: true })
        const docker_token = core.getInput('docker_token', { required: true })
        const config = core.getInput('config', { required: true })
        const versao = core.getInput('versao', { required: true })
        const tag = core.getInput('tag', { required: true })
        const dominio = core.getInput('dominio', { required: true })
        const api = core.getInput('api', { required: true })
        const stack = core.getInput('stack', { required: true })

        core.info('Build API - ' + api)

        core.info(dominio)
        core.info(tag)
        await docker.build(config, versao, tag, dominio, api)
            .catch((err) => {
                core.setFailed(err);
            });

        await docker.tag(tag, dominio, api)
            .catch((err) => {
                core.setFailed(err);
            });

        await docker.login(docker_username, docker_token)
            .catch((err) => {
                core.setFailed(err);
            });

        await docker.push(dominio, api, versao)
            .catch((err) => {
                core.setFailed(err);
            });
            
        await docker.push(dominio, api, 'latest')
            .catch((err) => {
                core.setFailed(err);
            });
        
        const _ssh = new ssh.ssh({
            host: ssh_host,
            port: ssh_port,
            username: ssh_username,
            password: ssh_password
        })

        core.info('Removendo stack ' + stack)
        await _ssh.comando(`sudo docker stack rm ${stack}`)

        core.info('Subindo stack GitFlow')
        await _ssh.comando(`sudo docker stack deploy -c ./${stack}/docker-compose.yml ${stack}`)

        core.info('Build API Finalizado')
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()