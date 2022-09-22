import * as core from '@actions/core';
import { NodeSSH, Config } from 'node-ssh';

export interface sshSettings {
    host: string
    port: number
    username: string
    password: string,
    key: string
}

export async function sshComando(settings:sshSettings, cmd: string): Promise<void> {
    
    try {
        var config;
        if (!settings.password) {
            config = {
                host: settings.host,
                port: settings.port,
                username: settings.username,
                privateKey: Buffer.from(settings.key)
            }
        } else if (!settings.key) {
            config = {
                host: settings.host,
                port: settings.port,
                username: settings.username,
                password: settings.password
            }
        }

        const ssh = new NodeSSH();

        ssh.connect(config)
            .then(() => {
                core.info('Conectado com sucesso')
            });

        ssh.execCommand(cmd)
            .then((result) => {
                if (result.stderr.length) throw new Error(result.stderr)
                core.info('STDOUT: ' + result.stdout)
            });

    } catch (error) {
        throw new Error('sshComando :: error: ' + error.message);
    }
}