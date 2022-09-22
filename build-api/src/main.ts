import * as core from '@actions/core';
import * as github from '@actions/github';
import * as docker from '../../lib/docker';
import * as shell from '../../lib/shell';
import { InputsBuildApi, getInputsBuildApi } from '../../lib/contexto';

async function run(): Promise<void> {
    
    try {
        const inputs: InputsBuildApi = getInputsBuildApi();

        core.info('Build API - ' + inputs.projeto);

        await docker.build(inputs.hub, inputs.projeto, inputs.config, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo)
            .catch((err) => {
                throw new Error(err);
            });

        await docker.tag(inputs.hub, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo)
            .catch((err) => {
                throw new Error(err);
            });

        await docker.login(inputs.docker_username, inputs.docker_token)
            .catch((err) => {
                throw new Error(err);
            });

        await docker.push(false, inputs.projeto, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo)
            .catch((err) => {
                throw new Error(err);
            });
            
        await docker.push(true, inputs.projeto)
            .catch((err) => {
                throw new Error(err);
            });
        
        core.info('Build API Finalizado');
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();