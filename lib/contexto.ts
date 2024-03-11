import * as core from '@actions/core';
import { countReset } from 'console';
import { RequestVersionamento } from '../lib/versionamento';

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
    path: string
    omitir_sudo: boolean
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
        latest: core.getBooleanInput('latest'),
        path: core.getInput('path'),
        omitir_sudo: core.getBooleanInput('omitir-sudo')
    }
}

export interface InputsPipeline {
    host: string
    port: number
    username: string
    password: string
    key: string,
    github_token: string,
    path: string
}

export function getInputsPipeline(): InputsPipeline {
    return {
        host: core.getInput('host'),
        port: Number(core.getInput('port')),
        username: core.getInput('username'),
        password: core.getInput('password'),
        key: core.getInput('key'),
        github_token: core.getInput('github_token'),
        path: core.getInput('path')
    }
}

export interface InputsVersionamento {
    requestVersionamento: RequestVersionamento
}

export function getInputsGerarVersionamento(): InputsVersionamento {
    return {
        requestVersionamento: {
            accountEndpoint: core.getInput('endpoint'),
            code: core.getInput('code'),
            token: core.getInput('token'),
            namePackage: core.getInput('name-package'),
            numeroVersao: undefined
        }
    }
}

export function getInputsResetVersionamento(): InputsVersionamento {
    return {
        requestVersionamento: {
            accountEndpoint: core.getInput('endpoint'),
            code: core.getInput('code'),
            token: core.getInput('token'),
            namePackage: undefined,
            numeroVersao: Number(core.getInput('numero-versao'))
        }
    }
}

export function getVersao(versao_major:string, versao_minor: string, versao_patch: string, versao_patch_sufixo?: string): string {

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
    core.info(versao);

    return versao;
}

export function getStack(stack: string): string {

    var mStack: string = stack.substring(stack.indexOf('/')+1);

    if (mStack.indexOf('/') !== -1) {
        return mStack.substring(0, mStack.indexOf('/'));
    }
    return mStack;
}

export function getDayOfYear(data: Date): number {
    var month: number = data.getMonth();
    var year: number = data.getFullYear();
    var days: number = data.getDate();
    for (var i = 0; i < month; i++) {
        days += new Date(year, i+1, 0).getDate();
    }
    return days;
}

export function getAnoSubstring(data: Date): string {
    return data.getFullYear().toString().substring(3);
}

export function getHoras(data: Date): string {
    var horas: number = data.getHours();

    return horas <= 9 ? '0' + horas.toString() : horas.toString();
}

export function getMinutos(data: Date): string {
    var minutos: number = data.getMinutes();

    return minutos <= 9 ? '0' + minutos.toString() : minutos.toString();
}
