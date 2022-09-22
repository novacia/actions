import * as core from '@actions/core';
import * as github from '@actions/github';
import * as docker from '../../lib/docker';
import { InputsBuildApi, getInputsBuildApi } from '../../lib/contexto';

async function run(): Promise<void> {
    
    try {
        const inputs: InputsBuildApi = getInputsBuildApi();

        core.info('Hub: ' + inputs.hub);

        // core.info('Build API - ' + inputs.api);

        // await docker.build(inputs.hub, inputs.config, inputs.versao, github.context.runNumber, inputs.api)
        //     .catch((err) => {
        //         throw new Error(err);
        //     });

        // await docker.tag(inputs.versao, github.context.runNumber, inputs.api, inputs.config)
        //     .catch((err) => {
        //         throw new Error(err);
        //     });

        // await docker.login(inputs.docker_username, inputs.docker_token)
        //     .catch((err) => {
        //         throw new Error(err);
        //     });

        // await docker.push(inputs.api, `${inputs.versao}.${github.context.runNumber}.0-${inputs.config}`)
        //     .catch((err) => {
        //         throw new Error(err);
        //     });
            
        // await docker.push(inputs.api, 'latest')
        //     .catch((err) => {
        //         throw new Error(err);
        //     });
        
        // core.info('Build API Finalizado');
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();