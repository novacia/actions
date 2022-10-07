import * as core from '@actions/core';
import { context } from '@actions/github';
import { InputsPipeline } from '../../../lib/contexto';
import * as ssh from '../../../lib/ssh';

export async function Created(inputs: InputsPipeline): Promise<void> {
    try {

    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Created - ' + error.message);
        }
    }
}

export async function Deleted(inputs: InputsPipeline): Promise<void> {
    try {
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Deleted - ' + error.message);
        }
    }
}

export async function Edited(inputs: InputsPipeline): Promise<void> {
    try {

    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Edited - ' + error.message);
        }
    }
}