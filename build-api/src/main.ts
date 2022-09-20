import * as core from '@actions/core'
import * as github from '@actions/github'
import * as docker from '../../lib/docker'
import * as ssh from '../../lib/ssh'

async function run(): Promise<void> {
    
    try {
        const dominio = core.getInput('hub')
        const api = core.getInput('api')
        const stack = core.getInput('stack')
        const config = core.getInput('config')
        const versao = core.getInput('versao')
        const ssh_host = core.getInput('ssh_host')
        const ssh_port = Number(core.getInput('ssh_port'))
        const ssh_username = core.getInput('ssh_username')
        const ssh_password = core.getInput('ssh_password')
        const docker_username = core.getInput('docker_username')
        const docker_token = core.getInput('docker_token')

        core.info('Build API - ' + api)

        await docker.build(dominio, config, versao, github.context.runNumber, api)
            .catch((err) => {
                throw new Error(err);
            });

        await docker.tag(versao, github.context.runNumber, api, config)
            .catch((err) => {
                throw new Error(err);
            });

        await docker.login(docker_username, docker_token)
            .catch((err) => {
                throw new Error(err);
            });

        await docker.push(api, `${versao}.${github.context.runNumber}.0-${config}`)
            .catch((err) => {
                throw new Error(err);
            });
            
        await docker.push(api, 'latest')
            .catch((err) => {
                throw new Error(err);
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