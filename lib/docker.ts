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

export async function build(dominio: string, config: string, versao: string, numberRun: number, api: string): Promise<void> {
    core.info('Build da imagem ' + api)

    if (!config || !versao || !numberRun || !api) {
        throw new Error('Parâmentros [config, version, numberRun, api] são obrigatórios')
    }

    const buildArray: Array<string> = new Array('--no-cache', '--build-arg', 'CONFIG=' + config)
    buildArray.push('--build-arg', `VERSAO=${versao}.${numberRun}.0-${config.toLowerCase()}`)
    buildArray.push('-t', `${dominio}/${api}:${versao}.${numberRun}.0-${config.toLowerCase()}`)
    buildArray.push('-f', `./${api}/Dockerfile ./${api}`)

    console.log(buildArray);

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

export async function tag(versao: string, numberRun: number, api: string, config: string): Promise<void> {
    core.info('Criando tag latest')

    if (!versao || !numberRun || !api || !config) {
        throw new Error('Parâmetros [versao, numberRun, api, config] são obrigatórios')
    }

    const tagArray: Array<string> = new Array('tag', `tqssolucoes/${api}:${versao}.${numberRun}.0-${config}`)
    tagArray.push(`tqssolucoes/${api}:latest`)

    await exec
        .getExecOutput('docker tag', tagArray, {
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

export async function push(api: string, versao: string): Promise<void> {
    core.info('Subindo imagem compilada - ' + versao)

    if (!versao || !api) {
        throw new Error('Parâmetro [versao, tag] é obrigatório')
    }

    await exec
        .getExecOutput('docker push', [ `tqssolucoes/${api}:${versao}` ], {
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