import * as core from '@actions/core'

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

export interface InputsBuildApi {
    hub: string
    projeto: string
    config: string
    versao_major: string
    versao_minor: string
    versao_patch: string
    versao_patch_sufixo: string
    docker_username: string
    docker_token: string
}

export function getInputsBuildApi(): InputsBuildApi {
    return {
        hub: core.getInput('hub'),
        projeto: core.getInput('projeto'),
        config: core.getInput('config'),
        versao_major: core.getInput('versao-major'),
        versao_minor: core.getInput('versao-minor'),
        versao_patch: core.getInput('versao-patch'),
        versao_patch_sufixo: core.getInput('versao-patch-sufixo'),
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
}

export function getInputsDeploy(): InputsDeploy {
    return {
        host: core.getInput('host'),
        port: Number(core.getInput('port')),
        username: core.getInput('username'),
        password: core.getInput('password'),
        key: core.getInput('key'),
        stack: core.getInput('stack')
    }
}

export function getVersao(versao_major:string, versao_minor: string, versao_patch: string, versao_patch_sufixo?: string): string {

    core.info('gerando versão');

    if (!!versao_major || !versao_minor || !versao_patch) {
        throw new Error('parâmetros [versao_major, versao_minor, versao_patch] são obrigatórios');
    }

    if (!['beta', 'rc'].indexOf(versao_patch_sufixo)) {
        throw new Error("parêmetro [versao_patch_sufixo] inválido - inputs permitidos (beta, rc)");
    }

    var versao: string = `${versao_major}.${versao_minor}:${versao_patch}`;
    if (versao_patch_sufixo) {
        versao = `${versao}-${versao_patch_sufixo}`;
    }

    return versao;
}