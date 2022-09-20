import * as core from '@actions/core'
import * as docker from '../../lib/docker'
import * as ssh from '../../lib/ssh'

async function run(): Promise<void> {
    
    try {
        const docker_username = core.getInput('docker_username', { required: true })
        const docker_token = core.getInput('docker_token', { required: true })
        const config = core.getInput('config', { required: true })
        const versao = core.getInput('versao', { required: true })
        const tag = core.getInput('tag', { required: true })
        const dominio = core.getInput('dominio', { required: true })
        const api = core.getInput('api', { required: true })

        core.info('Build API - ' + api)

        await docker.build(config, versao, tag, api)
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

        core.info('Subindo imagem compilad')
        await docker.push(dominio, api, versao)
            .catch((err) => {
                core.setFailed(err);
            });
            
        core.info('Subindo imagem latest')
        await docker.push(dominio, api, 'latest')
            .catch((err) => {
                core.setFailed(err);
            });

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()