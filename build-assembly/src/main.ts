import * as core from '@actions/core'
import * as github from '@actions/github'
import * as dotnet from '../../lib/dotnet'
import { shell } from '../../lib/shell'
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

        core.info('Version: ' + version)
        core.info('Build: ' + build)
        core.info('GITHUB_RUN_NUMBER: ' + github.context.runNumber)

        if (!fs.existsSync(csproj)) {
            throw new Error(`Arquivo [${csproj}] não existe`)
        }

        core.info(`Build do projeto ${csproj} em versão ${build}`)
        await dotnet.build(csproj, build, version, github.context.runNumber)
        //await shell(`dotnet build ${csproj} -c ${build} -p:Version=${version}.${github.context.runNumber}.0-${build.toLowerCase()}`)

        core.info(`Gerando pacote ${csproj} em versão ${build}`)
        await dotnet.pack(csproj, build, version, github.context.runNumber)
        //await shell(`dotnet pack ${csproj} -c ${build}  -p:PackageVersion=${version}.${github.context.runNumber}.0-${build.toLowerCase()} --no-build`)

        core.info('Adicionando nuget source')
        await dotnet.nuget_add_source(username, token)
        //await shell(`dotnet nuget add source -u ${username} -p ${token} --store-password-in-clear-text -n "github" "https://nuget.pkg.github.com/novacia/index.json"`)

        core.info(`Publicando pacote ${csproj} em versão ${build}`)
        await dotnet.nuget_push(nupkg, version, github.context.runNumber, build, token)
        //await shell(`dotnet nuget push ${nupkg}.${version}.${github.context.runNumber}.0-${build.toLowerCase()}.nupkg  -k ${token} --source "github" --skip-duplicate`)

        core.info('Build Finalizado')

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()