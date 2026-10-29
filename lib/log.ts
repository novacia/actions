export function linhasDeErro(output: string): string {
    const isErro = (linha?: string) => /\berror\b/i.test(linha ?? '');
    const linhas = output
        .replace(/\x1b\[[0-9;]*m/g, '')
        .split('\n')
        .map(linha => linha.replace(/^(#\d+ )?\d+\.\d+ /, '').trim())
        .filter(linha => linha && (isErro(linha) || !/\bwarning\b/i.test(linha)));
    const erros = linhas.filter((linha, i) => isErro(linha) || isErro(linhas[i - 1]));

    return [...new Set(erros.length > 0 ? erros : linhas.slice(-15))].join('\n').substring(0, 3000);
}
