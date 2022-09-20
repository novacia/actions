import * as core from '@actions/core'
import * as github from '@actions/github'
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
        
        console.log('build - Assembly')

        console.log('Version: ' + version)
        console.log('Build: ' + build)
        console.log('GITHUB_RUN_NUMBER: ' + github.context.runNumber)

        if (!fs.existsSync(csproj)) {
            throw new Error(`Arquivo [${csproj}] não existe`)
        }

        console.log(`Build do projeto ${csproj} em versão ${build}`)
        console.log(await shell(`dotnet build ${csproj} -c ${build} -p:Version=${version}.${github.context.runNumber}.0-${build.toLowerCase()}`))

        console.log(`Gerando pacote ${csproj} em versão ${build}`)
        console.log(await shell(`dotnet pack ${csproj} -c ${build}  -p:PackageVersion=${version}.${github.context.runNumber}.0-${build.toLowerCase()} --no-build`))

        console.log('Adicionando nuget source')
        console.log(await shell(`dotnet nuget add source -u ${username} -p ${token} --store-password-in-clear-text -n "github" "https://nuget.pkg.github.com/novacia/index.json"`))

        console.log(`Publicando pacote ${csproj} em versão ${build}`)
        console.log(await shell(`dotnet nuget push ${nupkg}.${version}.${github.context.runNumber}.0-${build.toLowerCase()}.nupkg  -k ${token} --source "github" --skip-duplicate`))

        console.log('Finalizando build')

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            core.setFailed(error.message)
        }
    }
}

run()