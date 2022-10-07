import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { context, getOctokit } from '@actions/github';
import { PushEvent } from '@octokit/webhooks-definitions/schema';
import * as pipeline from './lib/pipeline';
import { getInputsPipeline, InputsPipeline } from '../../lib/contexto';

async function run(): Promise<void> {
    
    var token: string = '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';

    try {
        var inputs: InputsPipeline = getInputsPipeline();

        var push: PushEvent = context.payload as PushEvent;

        var octokit = getOctokit(token);

        const result = await octokit.request("GET /repos/{owner}/{repo}/commits/{ref}", {
            headers: {
                authorization: `bearer ${token}`
            },
            owner: push.repository.full_name.split('/')[0],
            repo: push.repository.name,
            ref: push.after
        });

        console.log(result);

        // switch (context.payload.action) {
        //     case 'created':
        //         await pipeline.Created(inputs);
        //         break;
        //     case 'edited':
        //         await pipeline.Edited(inputs);
        //         break;
        //     case 'deleted':
        //         await pipeline.Deleted(inputs);
        //         break;
        //     default:
        //         core.info(`Action [${context.eventName}] sem tratamento`);
        //         break;
        // }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();