import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { PushEvent } from '@octokit/webhooks-definitions/schema';
import * as pipeline from './lib/pipeline';
import { getInputsPipeline, InputsPipeline } from '../../lib/contexto';

async function run(): Promise<void> {
    try {
        var inputs: InputsPipeline = getInputsPipeline();

        var push: PushEvent = context.payload as PushEvent;

        var octokit = getOctokit(inputs.github_token);

        const result = await octokit.request("GET /repos/{owner}/{repo}/commits/{ref}", {
            owner: push.repository.full_name.split('/')[0],
            repo: push.repository.name,
            ref: push.after
        });
        if (result.status = 200) {
            var files: Array<pipeline.Files> | undefined = result.data.files;

            files?.forEach((file) => {
                switch (file.status) {
                    case 'added':
                        pipeline.Created(inputs, file);
                        break;
                    case 'modified': case 'changed': case 'renamed':
                        pipeline.Edited(inputs, file)
                            .catch((err) => {
                                throw new Error(err);
                            });
                        break;
                    case 'removed':
                        pipeline.Deleted(inputs, file)
                            .catch((err) => {
                                throw new Error(err);
                            });
                        break;
                    default:
                        core.info(`Status [${file.status}] sem tratamento`);
                        break;
                }
            });
        }

        
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();