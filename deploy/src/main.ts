import * as core from '@actions/core';
import { InputsDeploy, getInputsDeploy, getStack, getVersao } from '../../lib/contexto';
import * as ssh from '../../lib/ssh';

async function run(): Promise<void> {

    var _config: string = '';

    try {
        const inputs: InputsDeploy = getInputsDeploy();

        const config: ssh.sshSettings = {
            host: inputs.host,
            port: inputs.port,
            username: inputs.username,
            password: inputs.password,
            key: inputs.key
        }

        var stack_name: string = getStack(inputs.stack);
        core.info('Deploy - Stack: ' + stack_name);

        core.info('Subindo stack ' + stack_name);
        core.info('DOCKERHUB_DOCKERID: ' + inputs.docker_username);
        core.info('DOCKERHUB_PASSWORD: ' + inputs.docker_token);
        
        if (inputs.config) {
            _config= `CONFIG=${inputs.config}`;
        }

        let _caminhoDeploy: string = inputs.path == '' ? `./${inputs.stack}/docker-compose.yml` : `${inputs.path}/${inputs.stack}/docker-compose.yml`;
         
        if (inputs.latest) {
            // await ssh.sshComando(config, `${!inputs.omitir_sudo ? 'sudo' : ''} env ${_config} docker stack deploy -c ${_caminhoDeploy} ${stack_name}`);
            await ssh.sshComando(config, `${!inputs.omitir_sudo ? 'sudo' : ''} deploy.sh ${stack_name} ${_caminhoDeploy} ${inputs.docker_username} ${inputs.docker_token} ${_config}`);
        }
        else {
            var _versao = getVersao(inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo);
            // await ssh.sshComando(config, `${!inputs.omitir_sudo ? 'sudo' : ''} env ${_config} VERSAO=${_versao} docker stack deploy -c ${_caminhoDeploy} ${stack_name}`);
            await ssh.sshComando(config, `${!inputs.omitir_sudo ? 'sudo' : ''} deploy.sh ${stack_name} ${_caminhoDeploy} ${inputs.docker_username} ${inputs.docker_token} ${_config} ${_versao}`);
        }
        
        core.info('Finalizando Deploy');

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();