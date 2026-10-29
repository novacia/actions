export function linhasDeErro(output: string): string {
    const linhas = output.split('\n').map(linha => linha.trim()).filter(linha => linha);
    const erros = linhas.filter(linha => /\berror\b/i.test(linha) && !/\bwarning\b/i.test(linha));

    return [...new Set(erros.length > 0 ? erros : linhas.slice(-15))].join('\n').substring(0, 3000);
}
