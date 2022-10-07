import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { context, getOctokit } from '@actions/github';
import { PushEvent } from '@octokit/webhooks-definitions/schema'
import * as pipeline from './lib/pipeline';
import { getInputsPipeline, InputsPipeline } from '../../lib/contexto';

async function run(): Promise<void> {
    
    try {
        var inputs: InputsPipeline = getInputsPipeline();

        var push: PushEvent = context.payload as PushEvent;

        console.log(context.payload.action);
        console.log(push);

        switch (context.payload.action) {
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
                core.info(`Action [${context.eventName}] sem tratamento`);
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