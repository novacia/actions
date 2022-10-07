import * as core from '@actions/core';
import * as github from '@actions/github';
import { PushEvent } from '@octokit/webhooks-definitions/schema'
import { InputsPipeline } from '../../../lib/contexto';
import * as ssh from '../../../lib/ssh';

export async function Created(inputs: InputsPipeline): Promise<void> {
    try {
        var push: PushEvent = github.context.payload as PushEvent;

        push.commits.forEach((data) => {
            data.added.forEach((added) => {
                core.info('added: ' + added);
            });
        });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Created - ' + error.message);
        }
    }
}

export async function Deleted(inputs: InputsPipeline): Promise<void> {
    try {
        var push: PushEvent = github.context.payload as PushEvent;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Deleted - ' + error.message);
        }
    }
}

export async function Edited(inputs: InputsPipeline): Promise<void> {
    try {
        var push: PushEvent = github.context.payload as PushEvent;

        push.commits.forEach((data) => {
            data.modified.forEach((modified) => {
                core.info('modified: ' + modified);
            });
        });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Edited - ' + error.message);
        }
    }
}