import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

interface Filtro {
    nome: string
    pasta: string
}

function getFiltros(): Array<Filtro> {
    return core.getInput('filters')
        .split('\n')
        .filter(linha => linha.includes('='))
        .map(linha => {
            const [nome, pasta] = linha.split('=');
            return { nome: nome.trim(), pasta: pasta.trim() };
        });
}

async function getArquivosAlterados(): Promise<Array<string>> {
    const push: any = context.payload as any;
    const octokit = getOctokit(core.getInput('github_token'));

    const result = await octokit.request("GET /repos/{owner}/{repo}/commits/{ref}", {
        owner: push.repository.full_name.split('/')[0],
        repo: push.repository.name,
        ref: push.after
    });

    if (result.status != 200) {
        throw new Error(`Erro ao obter os arquivos do commit: ${result.status}`);
    }

    return result.data.files?.map(file => file.filename) ?? [];
}

async function run(): Promise<void> {
    try {
        const arquivos: Array<string> = await getArquivosAlterados();
        const alterados: Array<string> = [];

        for (const filtro of getFiltros()) {
            const alterado: boolean = arquivos.some(arquivo => arquivo.startsWith(`${filtro.pasta}/`));

            core.info(`${filtro.nome} (${filtro.pasta}) -> ${alterado}`);
            core.setOutput(filtro.nome, alterado);

            if (alterado) {
                alterados.push(filtro.nome);
            }
        }

        core.setOutput('changed', alterados.join(' '));
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
