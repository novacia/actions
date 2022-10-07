import * as core from '@actions/core'
import { consumers } from 'stream'

export interface InputsBuildAssembly {
    versao_major: string
    versao_minor: string
    versao_patch: string
    versao_patch_sufixo: string
    config: string
    csproj: string
    nupkg: string
    username: string
    token: string
}

export function getInputsBuildAssembly(): InputsBuildAssembly {
    return {
        versao_major: core.getInput('versao-major'),
        versao_minor: core.getInput('versao-minor'),
        versao_patch: core.getInput('versao-patch'),
        versao_patch_sufixo: core.getInput('versao-patch-sufixo'),
        config: core.getInput('config'),
        csproj: core.getInput('csproj'),
        nupkg: core.getInput('nupkg'),
        username: core.getInput('username'),
        token: core.getInput('token')
    }
}

export interface InputsBuildDocker {
    hub: string
    projeto: string
    config: string
    versao_major: string
    versao_minor: string
    versao_patch: string
    versao_patch_sufixo: string
    latest: boolean
    docker_username: string
    docker_token: string
}

export function getInputsBuildDocker(): InputsBuildDocker {
    return {
        hub: core.getInput('hub'),
        projeto: core.getInput('projeto'),
        config: core.getInput('config'),
        versao_major: core.getInput('versao-major'),
        versao_minor: core.getInput('versao-minor'),
        versao_patch: core.getInput('versao-patch'),
        versao_patch_sufixo: core.getInput('versao-patch-sufixo'),
        latest: core.getBooleanInput('latest'),
        docker_username: core.getInput('docker_username'),
        docker_token: core.getInput('docker_token')
    }
}

export interface InputsDeploy {
    host: string
    port: number
    username: string
    password: string
    key: string
    stack: string
    config: string
    versao_major: string
    versao_minor: string
    versao_patch: string
    versao_patch_sufixo: string
    latest: boolean
}

export function getInputsDeploy(): InputsDeploy {
    return {
        host: core.getInput('host'),
        port: Number(core.getInput('port')),
        username: core.getInput('username'),
        password: core.getInput('password'),
        key: core.getInput('key'),
        stack: core.getInput('stack'),
        config: core.getInput('config'),
        versao_major: core.getInput('versao-major'),
        versao_minor: core.getInput('versao-minor'),
        versao_patch: core.getInput('versao-patch'),
        versao_patch_sufixo: core.getInput('versao-patch-sufixo'),
        latest: core.getBooleanInput('latest')
    }
}

export interface InputsPipeline {
    host: string
    port: number
    username: string
    password: string
    key: string
}

export function getInputsPipeline(): InputsPipeline {
    return {
        host: core.getInput(''),
        port: Number(core.getInput('')),
        username: core.getInput(''),
        password: core.getInput(''),
        key: core.getInput('')
    }
}

export function getVersao(versao_major:string, versao_minor: string, versao_patch: string, versao_patch_sufixo?: string): string {

    core.info('gerando versão');

    if (!versao_major || !versao_minor || !versao_patch) {
        throw new Error('parâmetros [versao_major, versao_minor, versao_patch] são obrigatórios');
    }

    if (versao_patch_sufixo && ['beta', 'rc'].indexOf(versao_patch_sufixo) == -1) {
        throw new Error("parêmetro [versao_patch_sufixo] inválido - inputs permitidos (beta, rc)");
    }

    var versao: string = `${versao_major}.${versao_minor}.${versao_patch}`;
    if (versao_patch_sufixo) {
        versao = `${versao}-${versao_patch_sufixo}`;
    }

    return versao;
}

export function getStack(stack: string): string {

    var mStack: string = stack.substring(stack.indexOf('/')+1);

    if (mStack.indexOf('/') !== -1) {
        return mStack.substring(0, mStack.indexOf('/'));
    }
    return mStack;
}
