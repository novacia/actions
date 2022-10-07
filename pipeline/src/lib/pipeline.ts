import * as core from '@actions/core';
import { context } from '@actions/github';
import { InputsPipeline } from '../../../lib/contexto';
import * as ssh from '../../../lib/ssh';

export interface Files {
    sha: string;
    filename: string;
    status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string | undefined;
    previous_filename?: string | undefined;
}

export async function Created(inputs: InputsPipeline, file: Files | undefined): Promise<void> {
    try {
        if (file == undefined) {
            throw new Error('paramêtro file indefinido')
        }

        var arquivo = file.filename.match(/(?<caminho>.+)(?<arquivo>\/[a-z]+\.[a-z]+)/)?.groups;

        if (!arquivo) {
            throw new Error('falha na expressão regular');
        }

        await ssh.sshMkdir({
                host: inputs.host,
                port: inputs.port,
                username: inputs.username,
                password: inputs.password,
                key: inputs.key
            }, arquivo.caminho, true);

    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Created - ' + error.message);
        }
    }
}

export async function Deleted(inputs: InputsPipeline, file: Files | undefined): Promise<void> {
    try {
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Deleted - ' + error.message);
        }
    }
}

export async function Edited(inputs: InputsPipeline, file: Files | undefined): Promise<void> {
    try {

    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Edited - ' + error.message);
        }
    }
}