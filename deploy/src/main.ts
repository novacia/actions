import * as core from '@actions/core';
import { InputsDeploy, getInputsDeploy } from '../../lib/contexto';
import { ssh } from '../../lib/ssh';

async function run(): Promise<void> {
    try {
        const inputs: InputsDeploy = getInputsDeploy();

        core.info('Deploy - ' + inputs.stack);

        const _conn = new ssh({
            host: inputs.host,
            port: inputs.port,
            username: inputs.username,
            password: inputs.password
        })
        core.info('Removendo stack ' + inputs.stack);
        _conn.comando(`sudo docker stack rm ${inputs.stack}`)
            .then((value) => {
                core.info(value);
            })
            .catch((err) => {
                core.setFailed(err);
            });
        core.info('Subindo stack ' + inputs.stack);
        _conn.comando(`sudo docker stack deploy -c ./${inputs.stack}/docker-compose.yml ${inputs.stack}`)
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