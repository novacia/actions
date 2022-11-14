import { HttpClient, HttpClientResponse } from '@actions/http-client';

interface ConsultaVersionamento {
    id: string,
    numeroVersao: number,
    dataVersao: Date
}

interface ResetVersionamento {
    numeroVersao: number
}

export async function consultaVersionamento(): Promise<ConsultaVersionamento | undefined> {
    var code: string = "code=YZrDC-oQKmhgNxjiI-EtvryTPsrDJ4r7FLUXCmgBwI9NAzFu8-rA_A=="
    var namePackage: string = "GitFlow.Eleicoes";

    var httpClient: HttpClient = new HttpClient();

    var response: HttpClientResponse =  await httpClient.get("https://tlv7-versionamento.azurewebsites.net/api/ConsultaVersionamento&" + code + "&" + namePackage, {
        "accountEndpoint": "https://usernosql.documents.azure.com:443/",
        "token": "sEpHfIs0BHC6wfE7swdbEGP4a4evFBud8k8m24VuvkIYV3b9eljtzMsbKvI9j2KyuFkHWjcktzHOACDbUr3O8w=="
    });

    if (response.message.statusCode == 200) {
        var body: string = await response.readBody();
        return JSON.parse(body) as ConsultaVersionamento;
    }

    return undefined;
}

export async function resetVersionamento(): Promise<ResetVersionamento | undefined> {
    return undefined;
}

consultaVersionamento()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log("error: " + err);
    });