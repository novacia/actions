import { HttpClient, HttpClientResponse } from '@actions/http-client';

export interface RequestVersionamento {
    code: string
    namePackage: string
    accountEndpoint: string
    token: string
    numeroVersao: number | undefined
}

export interface ResponseStatus {
    statusCode?: number
    statusMessage?: string
}

export interface ResponseGerarVersionamento {
    id: string | undefined
    numeroVersao: number | undefined
    dataVersao: Date | undefined
    responseStatus: ResponseStatus | undefined
}

export interface ResponseResetVersionamento {
    numeroVersao: number | undefined
    responseStatus: ResponseStatus | undefined
}

export async function gerarVersionamento(request: RequestVersionamento): Promise<ResponseGerarVersionamento> {
    var code: string = "code=" + request.code;
    var namePackage: string = "namePackage=" + request.namePackage;

    var httpClient: HttpClient = new HttpClient();

    var response: HttpClientResponse =  await httpClient.get("https://tlv7-versionamento.azurewebsites.net/api/GerarVersionamento?" + code + "&" + namePackage, {
        "accountEndpoint": request.accountEndpoint,
        "token": request.token
    });

    if (response.message.statusCode == 200) {
        var version: ResponseGerarVersionamento;
        return await response.readBody()
            .then((res) => {
                version = JSON.parse(res);
                version.responseStatus = {
                    statusCode: response.message.statusCode,
                    statusMessage: response.message.statusMessage
                };
            })
            .then(() => {
                return version;
            });
    }

    return {
        responseStatus: {
            statusCode: response.message.statusCode,
            statusMessage: response.message.statusMessage  
        } 
    } as ResponseGerarVersionamento;
}

export async function resetVersionamento(request: RequestVersionamento): Promise<ResponseResetVersionamento> {
    var code: string = "code=" + request.code;
    var namePackage: string = "namePackage=" + request.namePackage;

    var httpClient: HttpClient = new HttpClient();

    var response: HttpClientResponse = await httpClient.post("https://tlv7-versionamento.azurewebsites.net/api/ResetVersionamento?" + code + "&" + namePackage, 
        JSON.stringify({numeroVersao: request.numeroVersao}),{
        "accountEndpoint": request.accountEndpoint,
        "token": request.token
    });

    if (response.message.statusCode == 200) {
        var version: ResponseResetVersionamento;
        return await response.readBody()
            .then((res) => {
                version = JSON.parse(res);
                version.responseStatus = {
                    statusCode: response.message.statusCode,
                    statusMessage: response.message.statusMessage
                };
            })
            .then(() => {
                return version;
            });
    }

    return {
        responseStatus: {
            statusCode: response.message.statusCode,
            statusMessage: response.message.statusMessage  
        } 
    } as ResponseResetVersionamento;
}