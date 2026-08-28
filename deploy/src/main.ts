import * as core from '@actions/core';
import { InputsDeploy, getInputsDeploy, getStack, getVersao } from '../../lib/contexto';
import * as ssh from '../../lib/ssh';

const VERSAO_EM_EXECUCAO: string = `docker service inspect --format '{{index .Spec.Labels "com.docker.stack.image"}}'`;

function getVariaveisVersao(inputs: InputsDeploy, sudo: string, stack: string, versao: string): string {
    const buildados: Array<string> = inputs.built_services.split(/\s+/).filter(nome => nome);
    const variaveis: Array<string> = [];

    for (const par of inputs.services.split(/\s+/).filter(par => par.includes('='))) {
        const [nome, servico] = par.split('=');
        const variavel: string = `VERSAO_${nome.toUpperCase()}`;

        if (buildados.includes(nome)) {
            variaveis.push(`${variavel}=${versao}`);
            continue;
        }

        variaveis.push(`${variavel}=$(${sudo} ${VERSAO_EM_EXECUCAO} ${stack}_${servico} | cut -d: -f2)`);
    }

    core.info(variaveis.join(' '));
    return variaveis.join(' ');
}

async function deploy(config: ssh.sshSettings, comando: string): Promise<void> {
    const code: number = await ssh.sshComando(config, comando);

    if (code != 0) {
        throw new Error(`deploy falhou (${code})`);
    }
}

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
            await deploy(config, `${!inputs.omitir_sudo ? 'sudo' : ''} env ${_config} docker stack deploy --detach=false -c ${_caminhoDeploy} ${stack_name} --with-registry-auth`);
        }
        else {            
            var _versao = getVersao(inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo);
            var _sudo: string = !inputs.omitir_sudo ? 'sudo' : '';
            var _versoes: string = `VERSAO=${_versao}`;

            if (inputs.services) {
                _versoes = getVariaveisVersao(inputs, _sudo, stack_name, _versao);
            }

            await deploy(config, `${_sudo} env ${_config} ${_versoes} docker stack deploy --detach=false -c ${_caminhoDeploy} ${stack_name} --with-registry-auth`);
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