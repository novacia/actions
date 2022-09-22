import { Client, ConnectConfig, utils } from 'ssh2'
import * as core from '@actions/core'
import SSH2Promise  from 'ssh2-promise';

export interface sshSettings {
    host: string
    port: number
    username: string
    password: string,
    key: string
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

        var ssh = new SSH2Promise(config);

        ssh.connect()
            .then(() => {
                core.info('Conectado com sucesso')
            })
            .catch((err) => {
                throw new Error(err)
            });

        ssh.exec(cmd)
            .then((data) => {
                core.info(data)
            })
            .catch((err) => {
                throw new Error(err)
            });
    } catch (error) {
        throw new Error('sshComando :: error: ' + error.message);
    }
}