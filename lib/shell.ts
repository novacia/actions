import { exec } from 'child_process';

export async function shell(cmd:string): Promise<string> {
    return new Promise(Resolve => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                throw new Error(err.message)
            }
            else {
                Resolve(stdout)
            }
        })
    })
}