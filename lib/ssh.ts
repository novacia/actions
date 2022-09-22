import * as core from '@actions/core';
import { ConnectConfig, Client } from 'ssh2';

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

        const ssh = new Client();

        await new Promise((result) => {
            ssh.connect(config).on('ready', () => {
                core.info('Conectado com sucesso');
                return result(true);
            }).on('error', (err) => {
                core.info(err.message);
            });
        });

        await new Promise((result) => {
            ssh.exec(cmd, (err, stream) => {
                if (err) throw new Error(err.message)
                stream.on('close', (code, sginal) => {
                    ssh.end();
                    return result(true);
                }).on('data', (data) => {
                    core.info('STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    core.info('STDERR: ' + data);
                })
            });
        });

    } catch (error) {
        throw new Error('sshComando :: error: ' + error.message);
    }
}