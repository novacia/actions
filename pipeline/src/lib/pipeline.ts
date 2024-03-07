import * as core from '@actions/core';
import { InputsPipeline } from '../../../lib/contexto';
import * as ssh from '../../../lib/ssh';
import * as path from 'path'
import { join } from 'path';

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

export function Created(inputs: InputsPipeline, file: Files | undefined): void {
    try {
        core.info(`path -> ${inputs.path}`);

        if (file == undefined) {
            throw new Error('paramêtro file indefinido');
        }

        var settings: ssh.sshSettings = {
            host: inputs.host,
            port: inputs.port,
            username: inputs.username,
            password: inputs.password,
            key: inputs.key
        };

        var arquivo = file.filename.match(/(?<caminho>.+)(?<arquivo>\/.+\.[a-z]+)/)?.groups;

        core.info(`caminho -> ${arquivo.caminho}`);

        if (!arquivo) {
            throw new Error('falha na expressão regular');
        }

        ssh.sshMkdir(settings, inputs.path == '' ? arquivo.caminho : path.join(inputs.path, arquivo.caminho));

        ssh.sshScp(settings, path.join('./', file.filename), inputs.path == '' ? file.filename : path.join(inputs.path, file.filename));

    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Created - ' + error.message);
        }
    }
}

export function Deleted(inputs: InputsPipeline, file: Files | undefined): void {
    try {
        var settings: ssh.sshSettings = {
            host: inputs.host,
            port: inputs.port,
            username: inputs.username,
            password: inputs.password,
            key: inputs.key
        };

        ssh.sshRmdir(settings, inputs.path == '' ? file.filename : path.join(inputs.path, file.filename));

    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Deleted - ' + error.message);
        }
    }
}

export function Edited(inputs: InputsPipeline, file: Files | undefined): void {
    try {

        var settings: ssh.sshSettings = {
            host: inputs.host,
            port: inputs.port,
            username: inputs.username,
            password: inputs.password,
            key: inputs.key
        };

        ssh.sshScp(settings, path.join('./', file.filename), inputs.path == '' ? file.filename : path.join(inputs.path, file.filename));
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Pipeline Edited - ' + error.message);
        }
    }
}