import * as core from '@actions/core';
import * as github from '@actions/github';
import * as dotnet from '../../lib/dotnet';
import { InputsBuildAssembly, getInputsBuildAssembly } from '../../lib/contexto';
import * as fs from 'fs';

async function run(): Promise<void> {
    try {
        const inputs: InputsBuildAssembly = getInputsBuildAssembly();
        
        core.info('build - Assembly');

        if (!inputs.version || !inputs.build) {
            throw new Error('Parâmetros [version, build] inválidos ou não informados');
        }

        if (!inputs.csproj || !inputs.csproj.endsWith('.csproj')) {
            throw new Error('Parâmetro [csproj] inválido ou não informado')
        };

        if (!fs.existsSync(inputs.csproj)) {
            throw new Error(`Arquivo [${inputs.csproj}] não existe`);
        }

        core.info('Version: ' + inputs.version);
        core.info('Build: ' + inputs.build);
        core.info('GITHUB_RUN_ID: ' + github.context.runId);

        await dotnet.build(inputs.csproj, inputs.build, inputs.version, github.context.runId);
        await dotnet.pack(inputs.csproj, inputs.build, inputs.version, github.context.runId);
        await dotnet.nuget_add_source(inputs.username, inputs.token);
        await dotnet.nuget_push(inputs.nupkg, inputs.version, github.context.runId, inputs.build, inputs.token);

        core.info('build - Assembly [Finalizado]');

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
