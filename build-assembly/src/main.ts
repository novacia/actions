import * as core from '@actions/core'
import * as github from '@actions/github'
import { exec } from 'child_process';

async function run(): Promise<void> {
    try {
        const version = core.getInput('version', { required: true })
        const build = core.getInput('build', { required: true })
        const csproj = core.getInput('csproj', { required: true })
        
        console.log('build - Assembly')

        console.log('Version: ' + version)
        console.log('Build: ' + build)
        console.log('csproj: ' + csproj)
        console.log('GITHUB_RUN_NUMBER: ' + github.context.runNumber)

        exec('ls ./', (err, stdout, stderr) => {
            if (err) {
                console.log(err)
            } else {
                console.log({ stdout, stderr })
            }
        })

        console.log('Iniciando build')
        console.log('Finalizando build')

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()