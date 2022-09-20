import * as exec from '@actions/exec'
import * as core from '@actions/core'

export async function build(csproj:string, build:string, version:string, runNumber: number): Promise<void> {
    core.info('comando donet build')

    const buildArray: Array<string> = new Array('build', csproj);
    buildArray.push('-c', build)
    buildArray.push(`-p:Version=${version}.${runNumber}.0-${build.toLowerCase()}`)

    await exec
        .getExecOutput('dotnet', buildArray, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info(res.stdout)
        });
}

export async function pack(csproj:string, build:string, version:string, runNumber: number): Promise<void> {
    core.info('comando donet pack')

    const packArray: Array<string> = new Array('pack', csproj)
    packArray.push('-c', build)
    packArray.push(`-p:PackageVersion=${version}.${runNumber}.0-${build.toLowerCase()}`)
    packArray.push('--no-build')

    await exec
        .getExecOutput('dotnet', packArray, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info(res.stdout)
        });
}

export async function nuget_add_source(username:string, token:string): Promise<void> {
    core.info('comando donet nuget add')

    if (!username || !token) {
        throw new Error('username e token são obrigatórios')
    }

    const nuget_add_array: Array<string> = new Array('nuget', 'add', 'source')
    nuget_add_array.push('-u', username)
    nuget_add_array.push('-p', token, '--store-password-in-clear-text')
    nuget_add_array.push('-n', 'github')
    nuget_add_array.push('https://nuget.pkg.github.com/novacia/index.json')

    await exec
        .getExecOutput('dotnet', nuget_add_array, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info(res.stdout)
        });
}

export async function nuget_push(nupkg:string, version:string, runNumber: number, build:string, token:string): Promise<void> {
    core.info('comando donet nuget push')

    if (!nupkg || !token) {
        throw new Error('Parâmetros [nupkg, token] são obrigatórios')
    }

    const nuget_push_array: Array<string> = new Array('nuget', 'push')
    nuget_push_array.push(`${nupkg}.${version}.${runNumber}.0-${build.toLowerCase()}.nupkg`)
    nuget_push_array.push('-k', token)
    nuget_push_array.push('--source', 'github', '--skip-duplicate')

    await exec
        .getExecOutput('dotnet', nuget_push_array, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info(res.stdout)
        });
}