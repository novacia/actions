import * as core from '@actions/core';
import * as dotnet from '../../lib/dotnet';
import { InputsBuildAssembly, getInputsBuildAssembly } from '../../lib/contexto';
import * as fs from 'fs';

async function run(): Promise<void> {
    try {
        const inputs: InputsBuildAssembly = getInputsBuildAssembly();
        
        core.info('build - Assembly');

        if (!inputs.csproj) {
            throw new Error('Parâmetro [csproj] inválido ou não informado')
        };

        if (!fs.existsSync(inputs.csproj)) {
            throw new Error(`Arquivo [${inputs.csproj}] não existe`);
        }

        await dotnet.build(inputs.csproj, inputs.config, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo);
        await dotnet.pack(inputs.csproj, inputs.config, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo);
        await dotnet.nuget_add_source(inputs.username, inputs.token);
        await dotnet.nuget_push(inputs.nupkg, inputs.token, inputs.versao_major, inputs.versao_minor, inputs.versao_patch, inputs.versao_patch_sufixo);

        core.info('build - Assembly [Finalizado]');

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
