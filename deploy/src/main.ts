import * as core from '@actions/core';
import { InputsDeploy, getInputsDeploy, getStack } from '../../lib/contexto';
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

        const stack_name = getStack(inputs.stack);

        core.info('Removendo stack ' + stack_name);
        await ssh.sshComando(config, `sudo docker stack rm ${stack_name}`);

        core.info('Subindo stack ' + stack_name);
        await ssh.sshComando(config, `sudo docker stack deploy -c ./${inputs.stack}/docker-compose.yml ${stack_name}`);
        
        core.info('Finalizando Deploy');

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();