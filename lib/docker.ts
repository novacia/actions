import * as exec from '@actions/exec'
import * as core from '@actions/core'
import * as contexto from '../lib/contexto';

export async function login(username: string, password: string): Promise<void> {
    core.info('Autenticando no Docker Hub')

    if (!username || !password) {
        throw new Error('username e password são obrigatórios')
    }

    const loginArray: Array<string> = new Array('--username', username)
    loginArray.push('--password-stdin')

    await exec
        .getExecOutput('docker login', loginArray, {
            ignoreReturnCode: true,
            silent: true,
            input: Buffer.from(password)
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info('Login efetuado com Sucesso - STDOUT: ' + res.stdout)
        })
}

export async function build(hub: string, projeto: string, config: string, versao_major: string, versao_minor: string, versao_patch: string, versao_patch_sufixo: string): Promise<void> {
    core.info('Build da imagem ' + projeto)

    if (!hub || !projeto || !config || !versao_major || !versao_minor || !versao_patch) {
        throw new Error('Parâmentros [hub, projeto, config, versao_major, versao_minor, versao_patch] são obrigatórios')
    }

    var versao = contexto.getVersao(versao_major, versao_minor, versao_patch, versao_patch_sufixo)
    
    const buildArray: Array<string> = new Array('--build-arg', `CONFIG=${config}`)
    buildArray.push('--build-arg', `VERSAO=${versao}`)
    buildArray.push('-t', `${hub}:${versao}`)
    buildArray.push('-f', `./${projeto}/Dockerfile`, `./${projeto}`)

    await exec
        .getExecOutput('docker build --no-cache', buildArray, {
            ignoreReturnCode: true,
            silent: true            
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim())
            }
            core.info('STDOUT: ' + res.stdout)
        })
}

export async function tag(latest: boolean, hub: string, versao_major: string, versao_minor: string, versao_patch: string, versao_patch_sufixo: string): Promise<void> {
    core.info('Criando tag')

    if (!hub && !versao_major || !versao_minor || !versao_patch) {
        throw new Error('Parâmetros [hub, versao, numberRun, config] são obrigatórios')
    }

    var tagArray: Array<string> = new Array();
    if (!latest) {
        var tag: string = `${hub}:${versao_major}.${versao_minor}.${versao_patch}`;
        if (versao_patch_sufixo) {
            tag = `${tag}-${versao_patch_sufixo}`;
        }
        tagArray.push(tag);
    }
    else {
        var tag: string = `${hub}:${versao_major}.${versao_minor}.${versao_patch}`;
        if (versao_patch_sufixo) {
            tag = `${tag}-${versao_patch_sufixo}`;
        }
        var tag_latest: string = `${hub}:latest`;
        tagArray.push(tag, tag_latest);
    }

    await exec
        .getExecOutput('docker tag', tagArray, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 &&  res.exitCode != 0) {
                throw new Error(res.stderr.trim())
            }
            core.info('STDOUT: ' + res.stdout)
        })
}

export async function push(latest: boolean, hub: string, versao_major?: string, versao_minor?: string, versao_patch?: string, versao_patch_sufixo?: string): Promise<void> {
    
    if (!latest && !hub) {
        throw new Error('Parâmetro [latest, hub] é obrigatório')
    }

    var tag: string;
    if (latest) {
        tag = `${hub}:latest`;
    } else {
        tag = `${hub}:${versao_major}.${versao_minor}.${versao_patch}`;
        if (versao_patch_sufixo) {
            tag = `${tag}-${versao_patch_sufixo}`;
        }
    }

    core.info('Subindo imagem compilada - ' + tag)

    await exec
        .getExecOutput('docker push', [ tag ], {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 &&  res.exitCode != 0) {
                throw new Error(res.stderr.trim())
            }
            core.info('STDOUT: ' + res.stdout)
        })
}