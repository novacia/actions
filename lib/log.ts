export function linhasDeErro(output: string): string {
    const linhas = output
        .replace(/\x1b\[[0-9;]*m/g, '')
        .split('\n')
        .map(linha => linha.trim())
        .filter(linha => linha && !/\bwarning\b/i.test(linha));
    const isErro = (linha?: string) => /\berror\b/i.test(linha ?? '');
    const erros = linhas.filter((linha, i) => isErro(linha) || isErro(linhas[i - 1]));

    return [...new Set(erros.length > 0 ? erros : linhas.slice(-15))].join('\n').substring(0, 3000);
}
