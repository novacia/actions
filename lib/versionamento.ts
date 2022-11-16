import { HttpClient, HttpClientResponse } from '@actions/http-client';
import { resourceUsage } from 'process';

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

export interface ResponseConsultaVersionamento {
    id: string | undefined
    numeroVersao: number | undefined
    dataVersao: Date | undefined
    responseStatus: ResponseStatus | undefined
}

export interface ResponseResetVersionamento {
    numeroVersao: number | undefined
    responseStatus: ResponseStatus | undefined
}

export async function gerarVersionamento(request: RequestVersionamento): Promise<ResponseConsultaVersionamento> {
    var code: string = "code=" + request.code;
    var namePackage: string = "namePackage=" + request.namePackage;

    var httpClient: HttpClient = new HttpClient();

    var response: HttpClientResponse =  await httpClient.get("https://tlv7-versionamento.azurewebsites.net/api/ConsultaVersionamento?" + code + "&" + namePackage, {
        "accountEndpoint": request.accountEndpoint,
        "token": request.token
    });

    if (response.message.statusCode == 200) {
        var version: ResponseConsultaVersionamento;
        await response.readBody()
            .then((res) => {
                version = JSON.parse(res);
                version.responseStatus = {
                    statusCode: response.message.statusCode,
                    statusMessage: response.message.statusMessage
                };
            });
        return version;
    }

    return {
        responseStatus: {
            statusCode: response.message.statusCode,
            statusMessage: response.message.statusMessage  
        } 
    } as ResponseConsultaVersionamento;
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
        await response.readBody()
            .then((res) => {
                version = JSON.parse(res);
                version.responseStatus = {
                    statusCode: response.message.statusCode,
                    statusMessage: response.message.statusMessage
                };
            });
        return version;
    }

    return {
        responseStatus: {
            statusCode: response.message.statusCode,
            statusMessage: response.message.statusMessage  
        } 
    } as ResponseConsultaVersionamento;
}