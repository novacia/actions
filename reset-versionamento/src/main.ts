import { resetVersionamento,  } from '../../lib/versionamento';
import * as core from '@actions/core';
import { InputsVersionamento, getInputsResetVersionamento } from '../../lib/contexto';

async function run(): Promise<void> {
    try {
        const inputs: InputsVersionamento = getInputsResetVersionamento();

        await resetVersionamento(inputs.requestVersionamento)
            .then((res) => {
                if (res.responseStatus.statusCode == 200) {
                    core.info("Reset Versionamento realizado com sucesso!");
                }
                else {
                    throw new Error(`Error: ${res.responseStatus}`);
                }
            })
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed('reset-versionamento - ' + error.message);
        }
    }
}

run();