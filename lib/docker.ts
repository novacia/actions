import * as exec from '@actions/exec'
import * as core from '@actions/core'

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

export async function build(hub: string, config: string, versao: string, numberRun: number, api: string): Promise<void> {
    core.info('Build da imagem ' + api)

    if (!config || !versao || !numberRun || !api) {
        throw new Error('Parâmentros [config, version, numberRun, api] são obrigatórios')
    }

    const buildArray: Array<string> = new Array('--no-cache', '--build-arg', 'CONFIG=' + config)
    buildArray.push('--build-arg', `VERSAO=${versao}.${numberRun}.0-${config.toLowerCase()}`)
    buildArray.push('-t', `${hub}:${versao}.${numberRun}.0-${config.toLowerCase()}`)
    buildArray.push('-f', `./${api}/Dockerfile ./${api}`)

    await exec
        .getExecOutput('docker build', buildArray, {
            ignoreReturnCode: true,
            silent: true            
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim())
            }
            core.info('Build completo com Sucesso - STDOUT: ' + res.stdout)
        })
}

export async function tag(hub: string, versao: string, numberRun: number, config: string): Promise<void> {
    core.info('Criando tag latest')

    if (!hub && !versao || !numberRun || !config) {
        throw new Error('Parâmetros [hub, versao, numberRun, config] são obrigatórios')
    }

    await exec
        .getExecOutput('docker tag', [`${hub}:${versao}.${numberRun}.0-${config}`, `${hub}:latest`], {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 &&  res.exitCode != 0) {
                throw new Error(res.stderr.trim())
            }
            core.info('Tag criado com Sucesso - STDOUT: ' + res.stdout)
        })
}

export async function push(hub: string, versao: string): Promise<void> {
    core.info('Subindo imagem compilada - ' + versao)

    if (!hub && !versao) {
        throw new Error('Parâmetro [hub, versao] é obrigatório')
    }

    await exec
        .getExecOutput('docker push', [ `${hub}:${versao}` ], {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 &&  res.exitCode != 0) {
                throw new Error(res.stderr.trim())
            }
            core.info('Subida conclída - STDOUT: ' + res.stdout)
        })
}