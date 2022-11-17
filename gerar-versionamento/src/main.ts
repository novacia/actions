import { gerarVersionamento } from '../../lib/versionamento';
import { InputsVersionamento, getInputsGerarVersionamento } from '../../lib/contexto';
import * as core from '@actions/core';

async function run(): Promise<void> {
    try {
        const inputs: InputsVersionamento = getInputsGerarVersionamento();

        await gerarVersionamento(inputs.requestVersionamento)
        .then((res) => {
            if (res.responseStatus?.statusCode == 200) {
                core.info("Geração de Versionamento realizado com sucesso!")
                core.info("JSON: " + JSON.stringify(res));
                core.info("numeroVersao: " + res.numeroVersao);
                core.setOutput("versao_minor", res.numeroVersao);
            }
            else {
                throw new Error(`Error: ${res.responseStatus}`);
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed('gerar-versionamento - ' + error.message);
        }
    }
}

run();
