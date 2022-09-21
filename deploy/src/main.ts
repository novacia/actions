import * as core from '@actions/core';
import { InputsDeploy, getInputsDeploy } from '../../lib/contexto';
import { ssh } from '../../lib/ssh';

async function run(): Promise<void> {
    try {
        const inputs: InputsDeploy = getInputsDeploy();

        core.info('Deploy - ' + inputs.name_docker);

        const _conn = new ssh({
            host: inputs.host,
            port: inputs.port,
            username: inputs.username,
            password: inputs.password
        })
        core.info('Removendo stack ' + inputs.name_docker);
        _conn.comando(`sudo docker stack rm ${inputs.name_docker}`)
            .then((value) => {
                core.info(value);
            })
            .catch((err) => {
                core.setFailed(err);
            });
        core.info('Subindo stack ' + inputs.name_docker);
        _conn.comando(`sudo docker stack deploy -c ./${inputs.name_docker}/docker-compose.yml ${inputs.name_docker}`)
            .then((value) => {
                core.info(value);
            })
            .catch((err) => {
                core.setFailed(err);
            });
        
        core.info('Finalizando Deploy');

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run()