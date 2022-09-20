import * as core from '@actions/core'
import * as github from '@actions/github'
import * as dotnet from '../../lib/dotnet'
import * as fs from 'fs'

async function run(): Promise<void> {
    try {
        const version = core.getInput('version', { required: true })
        const build = core.getInput('build', { required: true })
        const csproj = core.getInput('csproj', { required: true })
        const nupkg = core.getInput('nupkg', { required: true })
        const username = core.getInput('username', { required: true })
        const token = core.getInput('token', { required: true })
        
        core.info('build - Assembly')

        if (!version || !build) {
            throw new Error('Parâmetros [version, build] inválidos ou não informados')
        }

        if (!csproj || !csproj.endsWith('.csproj')) {
            throw new Error('Parâmetro [csproj] inválido ou não informado')
        }

        if (!fs.existsSync(csproj)) {
            throw new Error(`Arquivo [${csproj}] não existe`)
        }

        core.info('Version: ' + version)
        core.info('Build: ' + build)
        core.info('GITHUB_RUN_NUMBER: ' + github.context.runNumber)

        core.info(`Build do projeto ${csproj} em versão ${build}`)
        await dotnet.build(csproj, build, version, github.context.runNumber)

        core.info(`Gerando pacote ${csproj} em versão ${build}`)
        await dotnet.pack(csproj, build, version, github.context.runNumber)

        core.info('Adicionando nuget source')
        await dotnet.nuget_add_source(username, token)

        core.info(`Publicando pacote ${csproj} em versão ${build}`)
        await dotnet.nuget_push(nupkg, version, github.context.runNumber, build, token)

        core.info('Build Finalizado')

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()