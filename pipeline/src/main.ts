import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import * as pipeline from './lib/pipeline';
import { getInputsPipeline, InputsPipeline } from '../../lib/contexto';

async function run(): Promise<void> {
    
    try {
        var inputs: InputsPipeline = getInputsPipeline();

        switch (github.context.action) {
            case 'created':
                await pipeline.Created(inputs);
                break;
            case 'edited':
                await pipeline.Edited(inputs);
                break;
            case 'deleted':
                await pipeline.Deleted(inputs);
                break;
            default:
                core.info(`Action [${github.context.action}] sem tratamento`);
                break;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();