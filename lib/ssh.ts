import * as core from '@actions/core';
import { ConnectConfig, Client } from 'ssh2';
import ClientSftp = require('ssh2-sftp-client');

export interface sshSettings {
    host: string
    port: number
    username: string
    password: string,
    key: string
}

export function sshConfig(settings: sshSettings): ConnectConfig {

    if (!settings.password) {
        return {
            host: settings.host,
            port: settings.port,
            username: settings.username,
            privateKey: settings.key
        }
    }
    else if (!settings.key) {
        return {
            host: settings.host,
            port: settings.port,
            username: settings.username,
            password: settings.password
        }
    }
    return {};
}

export async function sshComando(settings:sshSettings, cmd: string): Promise<void> {
    
    try {
        var config: ConnectConfig = sshConfig(settings);

        const ssh = new Client();

        await new Promise((result) => {
            ssh.connect(config).on('ready', () => {
                return result(true);
            }).on('error', (err) => {
                throw new Error(err.message);
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

export async function sshMkdir(settings: sshSettings, path: string): Promise<void> {
    try {
        var config: ConnectConfig = sshConfig(settings);

        const ssh = new Client();

        await new Promise((result) => {
            ssh.connect(config).on('ready', () => {
                return result(true);
            }).on('error', (err) => {
                throw new Error(err.message);
            });
        });

        core.info(`criando Diretório '${path}'`);

        await new Promise((result) => {
            ssh.exec(`mkdir -pv ${path}`, (err, stream) => {
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
    }
    catch (error) {
        throw new Error('sshMkdir :: error: ' + error.message);
    }
}

export async function sshScp(settings: sshSettings, target, source): Promise<void> {
    try {
        const client = new ClientSftp();

        await client.connect({
                host: settings.host,
                port: settings.port,
                username: settings.username,
                password: settings.password,
                privateKey: settings.key
            }).then(() => null);

        await client.put(target, source)
            .then((data) =>  { 
                core.info('STDOUT: ' + data);
            })
            .catch((err) => {
                throw new Error(err);
            });

        await client.end();
    }
    catch (error) {
        throw new Error('sshScp :: error: ' + error.message);
    }
}