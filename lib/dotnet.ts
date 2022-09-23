import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as contexto from '../lib/contexto';

export async function build(csproj:string, config:string, versao_major:string, versao_minor: string, versao_patch: string, versao_patch_sufixo: string): Promise<void> {
    core.info(`Build do projeto ${csproj} em versão ${config}`);
    core.info(['beta', 'rc'].indexOf(versao_patch_sufixo).toString());
    var versao: string = contexto.getVersao(versao_major, versao_minor, versao_patch, versao_patch_sufixo);

    const buildArray: Array<string> = new Array('build', csproj);
    buildArray.push('-c', config);
    buildArray.push(`-p:Version=${versao}`);

    await exec
        .getExecOutput('dotnet', buildArray, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info(res.stdout);
        });
}

export async function pack(csproj:string, config:string, versao_major:string, versao_minor: string, versao_patch: string, versao_patch_sufixo: string): Promise<void> {
    core.info(`Gerando pacote ${csproj} em versão ${config}`);

    var versao: string = contexto.getVersao(versao_major, versao_minor, versao_patch, versao_patch_sufixo);

    const packArray: Array<string> = new Array('pack', csproj);
    packArray.push('-c', config);
    packArray.push(`-p:PackageVersion=${versao}`);
    packArray.push('--no-build');

    await exec
        .getExecOutput('dotnet', packArray, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info(res.stdout);
        });
}

export async function nuget_add_source(username:string, token:string): Promise<void> {
    core.info('Adicionando nuget source');

    if (!username || !token) {
        throw new Error('username e token são obrigatórios');;
    }

    const nuget_add_array: Array<string> = new Array('nuget', 'add', 'source');
    nuget_add_array.push('-u', username);
    nuget_add_array.push('-p', token, '--store-password-in-clear-text');
    nuget_add_array.push('-n', 'github');
    nuget_add_array.push('https://nuget.pkg.github.com/novacia/index.json');

    await exec
        .getExecOutput('dotnet', nuget_add_array, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info(res.stdout);
        });
}

export async function nuget_push(nupkg:string, token:string, versao_major:string, versao_minor: string, versao_patch: string, versao_patch_sufixo: string): Promise<void> {
    core.info(`Publicando pacote ${nupkg} em versão ${build}`);

    if (!nupkg || !token) {
        throw new Error('Parâmetros [nupkg, token] são obrigatórios');
    }

    var versao: string = contexto.getVersao(versao_major, versao_minor, versao_patch, versao_patch_sufixo);

    const nuget_push_array: Array<string> = new Array('nuget', 'push');
    nuget_push_array.push(`${nupkg}.${versao}.nupkg`);
    nuget_push_array.push('-k', token);
    nuget_push_array.push('--source', 'github', '--skip-dupli;cate');

    await exec
        .getExecOutput('dotnet', nuget_push_array, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error(res.stderr.trim());
            }
            core.info(res.stdout);
        });
}