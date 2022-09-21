import * as core from '@actions/core'

export interface InputsBuildAssembly {
    version: string
    build: string
    csproj: string
    nupkg: string
    username: string
    token: string
}

export function getInputsBuildAssembly(): InputsBuildAssembly {
    return {
        version: core.getInput('version'),
        build: core.getInput('build'),
        csproj: core.getInput('csproj'),
        nupkg: core.getInput('nupkg'),
        username: core.getInput('username'),
        token: core.getInput('token')
    }
}

export interface InputsBuildApi {
    hub: string
    api: string
    stack: string
    config: string
    versao: string
    docker_username: string
    docker_token: string
}

export function getInputsBuildApi(): InputsBuildApi {
    return {
        hub: core.getInput('hub'),
        api: core.getInput('api'),
        stack: core.getInput('stack'),
        config: core.getInput('config'),
        versao: core.getInput('versao'),
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