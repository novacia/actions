import * as core from '@actions/core'
import { ssh, sshSettings } from '../../lib/ssh'

async function run(): Promise<void> {
    try {
        const settings: sshSettings = {
            host: core.getInput('host', { required: true }),
            port: 22,
            username: core.getInput('username', { required: true }),
            password: core.getInput('password', { required: true })
        }
        const name_docker = core.getInput('name_docker', { required: true })

        core.info('Deploy - ' + name_docker)

        const _conn = new ssh(settings)
        core.info('Removendo stack ' + name_docker)
        _conn.comando(`sudo docker stack rm ${name_docker}`)
            .then((value) => {
                core.info(value)
            })
            .catch((err) => {
                core.setFailed(err)
            })
        core.info('Subindo stack ' + name_docker)
        _conn.comando(`sudo docker stack deploy -c ./${name_docker}/docker-compose.yml ${name_docker}`)
            .then((value) => {
                core.info(value)
            })
            .catch((err) => {
                core.setFailed(err)
            })
        
        core.info('Finalizando Deploy')

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()