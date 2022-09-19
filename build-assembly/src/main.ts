import * as core from '@actions/core'

const version = 7

async function buildAssembly(): Promise<void> {
    try {
        const build = core.getInput('build', { required: true })

        core.debug('build - Assembly')
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

buildAssembly()