import * as core from '@actions/core';
import { ConnectConfig, Client } from 'ssh2';
import ClientSftp from 'ssh2-sftp-client';
import { Client as ClientScp } from 'node-scp';
import * as fs from 'fs';

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
                core.info('Conectado com sucesso');
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

export async function sshMkdir(settings: sshSettings, path: string, recursive?: boolean): Promise<void> {
    try {
        var config: ConnectConfig = sshConfig(settings);

        const ssh = new ClientSftp();

        await ssh.connect(config);

        core.info(`criado Diretório [${path}]`);

        await ssh.mkdir(path, recursive);

        await ssh.stat(path)
            .then((stat) => {
                if (stat.isDirectory) {
                    core.info(`Diretório [ ${path} ] criado com sucesso`);
                }
            })
            .catch((err) => {
                if (err instanceof Error) {
                    ssh.end();
                    throw new Error(err.message);
                }
            });

        await ssh.end();
    }
    catch (error) {
        throw new Error('sshMkdir :: error: ' + error.message);
    }
}

export async function sshScp(settings: sshSettings, target, source) {
    try {

        var client = await ClientScp(settings);
        
        await client.uploadFile(target, source)
            .then(() => {
                core.info('uploadoFile concluido com sucesso');
            })
            .catch(() => {
                client.close();
                throw new Error('falha ao efetuar uploadoFile');
            });

        client.close();

    }
    catch (error) {
        throw new Error('sshScp :: error: ' + error.message);
    }
}