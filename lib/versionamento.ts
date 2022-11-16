import { HttpClient, HttpClientResponse } from '@actions/http-client';
import { resourceUsage } from 'process';

export interface RequestVersionamento {
    code: string,
    namePackage: string,
    accountEndpoint: string,
    token: string,
    numeroVersao: number | undefined
}

export interface ResponseError {
    statusCode: number | undefined,
    statusMessage: string | undefined
}

export interface ResponseConsultaVersionamento {
    id: string,
    numeroVersao: number,
    dataVersao: Date
}

export interface ResponseResetVersionamento {
    numeroVersao: number | undefined
}

export async function consultaVersionamento(request: RequestVersionamento): Promise<ResponseConsultaVersionamento | ResponseError> {
    var code: string = "code=" + request.code;
    var namePackage: string = "namePackage=" + request.namePackage;

    var httpClient: HttpClient = new HttpClient();

    var response: HttpClientResponse =  await httpClient.get("https://tlv7-versionamento.azurewebsites.net/api/ConsultaVersionamento?" + code + "&" + namePackage, {
        "accountEndpoint": request.accountEndpoint,
        "token": request.token
    });

    if (response.message.statusCode == 200) {
        var body: string = await response.readBody();
        return JSON.parse(body) as ResponseConsultaVersionamento;
    }

    return {
        statusCode: response.message.statusCode,
        statusMessage: response.message.statusMessage
    };
}

export async function resetVersionamento(request: RequestVersionamento): Promise<ResponseResetVersionamento | ResponseError> {
    var code: string = "code=" + request.code;
    var namePackage: string = "namePackage=" + request.namePackage;

    var jsonReset: ResponseResetVersionamento = {
        numeroVersao: request.numeroVersao
    };

    var httpClient: HttpClient = new HttpClient();

    var response: HttpClientResponse = await httpClient.post("https://tlv7-versionamento.azurewebsites.net/api/ResetVersionamento?" + code + "&" + namePackage, JSON.stringify(jsonReset),{
        "accountEndpoint": request.accountEndpoint,
        "token": request.token
    });

    if (response.message.statusCode == 200) {
        var body: string = await response.readBody();
        return JSON.parse(body) as ResponseResetVersionamento;
    }
    return {
        statusCode: response.message.statusCode,
        statusMessage: response.message.statusMessage
    };
}