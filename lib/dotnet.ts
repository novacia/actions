import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as contexto from '../lib/contexto';
import { linhasDeErro } from '../lib/log';

export async function build(csproj:string, config:string, versao_major:string, versao_minor: string, versao_patch: string, versao_patch_sufixo: string): Promise<void> {
    core.info(`Build do projeto ${csproj} em versão ${config}`);
    
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
                throw new Error('[build] - ' + linhasDeErro(res.stderr));
            }
            else if (res.exitCode != 0) {
                throw new Error('[build] - ' + linhasDeErro(res.stdout));
            }
            core.info(res.stdout.trim());
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
                throw new Error('[pack] - ' + linhasDeErro(res.stderr));
            }
            else if (res.exitCode != 0) {
                throw new Error('[pack] - ' + linhasDeErro(res.stdout));
            }
            core.info(res.stdout.trim());
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
                throw new Error('[nuget_add_source] - ' + linhasDeErro(res.stderr));
            }
            else if (res.exitCode != 0) {
                throw new Error('[nuget_add_source] - ' + linhasDeErro(res.stdout));
            }
            core.info(res.stdout.trim());
        });
}

export async function nuget_push(nupkg:string, token:string, versao_major:string, versao_minor: string, versao_patch: string, versao_patch_sufixo: string): Promise<void> {

    if (!nupkg || !token) {
        throw new Error('Parâmetros [nupkg, token] são obrigatórios');
    }

    var versao: string = contexto.getVersao(versao_major, versao_minor, versao_patch, versao_patch_sufixo);

    core.info(`Publicando pacote ${nupkg} em versão ${versao}`);

    const nuget_push_array: Array<string> = new Array('nuget', 'push');
    nuget_push_array.push(`${nupkg}.${versao}.nupkg`);
    nuget_push_array.push('-k', token);
    nuget_push_array.push('--source', 'github', '--skip-duplicate');

    await exec
        .getExecOutput('dotnet', nuget_push_array, {
            ignoreReturnCode: true,
            silent: true
        })
        .then(res => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
                throw new Error('[nuget_push] - ' + linhasDeErro(res.stderr));
            }
            else if (res.exitCode != 0) {
                throw new Error('[nuget_push] - ' + linhasDeErro(res.stdout));
            }
            core.info(res.stdout.trim());
        });
}