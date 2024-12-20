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
        
        if (inputs.config) {
            _config= `CONFIG=${inputs.config}`;
        }

        let _caminhoDeploy: string = inputs.path == '' ? `./${inputs.stack}/docker-compose.yml` : `${inputs.path}/${inputs.stack}/docker-compose.yml`;
        
        try{
            await ssh.sshComando(config, `echo ${inputs.docker_token} | ${!inputs.omitir_sudo ? 'sudo' : ''} docker login deploy -u ${inputs.docker_username} --password-stdin`);
            core.info("Login Realizado com sucesso.")
        }
        catch(error){
            core.warning("Falha ao realizar o Login do Docker !");
            core.warning(error.message);
        }
        

        if (inputs.latest) {
            await ssh.sshComando(config, `${!inputs.omitir_sudo ? 'sudo' : ''} env ${_config} docker stack deploy -c ${_caminhoDeploy} ${stack_name} --with-registry-auth`);            
        }
        else {            
            var _versao = getVersao(inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo);
            await ssh.sshComando(config, `${!inputs.omitir_sudo ? 'sudo' : ''} env ${_config} VERSAO=${_versao} docker stack deploy -c ${_caminhoDeploy} ${stack_name} --with-registry-auth`);            
        }
        
        core.info('Finalizando Deploy');
        core.info(inputs.docker_username);
        core.info(inputs.docker_token);

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();