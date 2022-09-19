import * as core from '@actions/core'

const version = 7

async function run(): Promise<void> {
    try {
        const build = core.getInput('build', { required: true })

        core.debug('build - Assembly')
        core.debug('Iniciando build')
        core.debug('Finalizando build')

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()