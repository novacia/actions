import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import { PushEvent } from '@octokit/webhooks-definitions/schema'
import * as pipeline from './lib/pipeline';
import { getInputsPipeline, InputsPipeline } from '../../lib/contexto';

async function run(): Promise<void> {
    
    try {
        var inputs: InputsPipeline = getInputsPipeline();

        var push: PushEvent = github.context.payload as PushEvent;

        console.log(github.context.payload.action);
        console.log(push.head_commit?.added)
        console.log(push.head_commit?.modified)
        console.log(push.head_commit?.removed)

        switch (github.context.payload.action) {
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
                core.info(`Action [${github.context.eventName}] sem tratamento`);
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