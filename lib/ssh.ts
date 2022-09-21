import { Client, ConnectConfig, utils } from 'ssh2'
import * as core from '@actions/core'
import { consumers, PassThrough, Stream } from 'stream'

export interface sshSettings {
    host: string
    port: number
    username: string
    password: string,
    key: string
}

export class sshGithub {

    private _config: ConnectConfig;
    private _ssh: Client;

    constructor(settings:sshSettings) {
        if (!settings.password) {
            this._config = {
                host: settings.host,
                port: settings.port,
                username: settings.username,
                privateKey: settings.key
            };
        } else if (!settings.key) {
            this._config = {
                host: settings.host,
                port: settings.port,
                username: settings.username,
                password: settings.password
            };
        }
        this._ssh = new Client();
    }

    comado(cmd: string): void {
        this._ssh.on('ready', () => {
            this._ssh.exec(cmd, (err, stream) => {
                if (err) throw new Error(err.message);
                stream.on('data', (data) => {
                    core.info('exec STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    throw new Error('exec STDOUT: ' + data)
                }).on('close', (code, signal) => {
                    core.info('Code: ' + code + ', Signal: ' + signal);
                    this._ssh.end();
                })
            });
        }).on('error', (err) => {
            core.info('Client SSH :: error: ' + err.message);
        });
    }
}

export async function sshComando(settings:sshSettings, cmd: string): Promise<void> {
    
    try {
        var config: ConnectConfig;
        if (!settings.password) {
            config = {
                host: settings.host,
                port: settings.port,
                username: settings.username,
                privateKey: settings.key
            }
        } else if (!settings.key) {
            config = {
                host: settings.host,
                port: settings.port,
                username: settings.username,
                password: settings.password
            }
        }

        const ssh = new Client()

        ssh.on('ready', () => {
            core.info('Client SSH :: conectado com sucesso');
            ssh.exec(cmd, (err, stream) => {
                if (err) throw new Error(err.message);
                stream.on('data', (data) => {
                    core.info('exec STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    throw new Error('exec STDOUT: ' + data)
                }).on('close', (code, signal) => {
                    core.info('Code: ' + code + ', Signal: ' + signal)
                    ssh.end();
                })
            });
        }).on('error', (err) => {
            core.info('Client SSH :: error: ' + err.message);
        }).connect(config).on('end', () => {
            core.info('Client SSH :: desconectado');
        });
    } catch (error) {
        throw new Error('sshComando :: error: ' + error.message);
    }
}
