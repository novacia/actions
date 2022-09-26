import * as core from '@actions/core';
import { InputsDeploy, getInputsDeploy } from '../../lib/contexto';
import * as ssh from '../../lib/ssh';

async function run(): Promise<void> {
    try {
        const inputs: InputsDeploy = getInputsDeploy();

        core.info('Deploy - ' + inputs.stack);

        const config: ssh.sshSettings = {
            host: inputs.host,
            port: inputs.port,
            username: inputs.username,
            password: inputs.password,
            key: inputs.key
        }

        core.info('Removendo stack ' + inputs.stack);
        await ssh.sshComando(config, `sudo docker stack rm ${inputs.stack}`);

        core.info('Subindo stack ' + inputs.stack);
        await ssh.sshComando(config, `sudo docker stack deploy -c ./${inputs.stack}/docker-compose.yml ${inputs.stack}`);
        
        core.info('Finalizando Deploy');

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();