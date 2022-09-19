import * as core from '@actions/core'
import * as github from '@actions/github'

const version = 7

async function run(): Promise<void> {
    try {
        const build = core.getInput('build', { required: true })
        const csproj = core.getInput('csproj', { required: true })
        
        console.log('build - Assembly')

        console.log('Build: ' + build)
        console.log('csproj: ' + csproj)
        console.log('GITHUB_RUN_NUMBER: ' + github.context.runNumber)

        console.log('Iniciando build')
        console.log('Finalizando build')

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()