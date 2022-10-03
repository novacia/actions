import * as core from '@actions/core';
import * as docker from '../../lib/docker';
import { InputsBuildDocker, getInputsBuildDocker } from '../../lib/contexto';

async function run(): Promise<void> {
    
    try {
        const inputs: InputsBuildDocker = getInputsBuildDocker();

        core.info('Build API - ' + inputs.projeto);

        await docker.build(inputs.hub, inputs.projeto, inputs.config, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo)
            .catch((err) => {
                throw new Error(err);
            });

        await docker.tag(inputs.latest, inputs.hub, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo)
            .catch((err) => {
                throw new Error(err);
            });

        await docker.login(inputs.docker_username, inputs.docker_token)
            .catch((err) => {
                throw new Error(err);
            });

        if (inputs.latest) {
            await docker.push(inputs.latest, inputs.hub, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo)
                .catch((err) => {
                    throw new Error(err);
                });
            await docker.push(inputs.latest, inputs.hub)
                .catch((err) => {
                    throw new Error(err);
                });
        }
        else {
            await docker.push(inputs.latest, inputs.hub, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo)
                .catch((err) => {
                    throw new Error(err);
                });
        }
        
        core.info('Build API Finalizado');
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();