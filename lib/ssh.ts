import { Client } from 'ssh2'
import * as core from '@actions/core'

export interface sshSettings {
    host: string
    port: number
    username: string
    password: string
}

export class ssh {

    private _status: boolean
    private _conn: Client

    constructor(settings: sshSettings) {
        this._conn = new Client()
        try {
            this._conn.on('ready', () => {
                console.log('Client :: ready');
            }).on('error', (err) => {
                console.log('Client :: error: ' + err.message);
            }).connect({
                host: settings.host,
                port: settings.port,
                username: settings.username,
                password: settings.password
            })
        } catch (error) {
            if (error instanceof Error) console.log(error.message)
        }
    }

    async comando(cmd: string): Promise<string> {
        try {
            if (!this._status) {
                throw new Error('Não possui executar o comando, pois a conexão SSH falhou')
            }

            return new Promise(retorno => {
                this._conn.exec(cmd, (err, stream) => {
                    if (err) throw new Error(err.message)
                    stream.on('data', (data) => {
                        retorno('STDOUT: ' + data)
                    }).stderr.on('data', (data) => {
                        retorno('STDERR: ' + data)
                    }).on('exit', (code, signal) => {
                        core.info('Code: ' + code + ', Signal: ' + signal)
                    })
                })
            })
            
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message)
        }
    }
}