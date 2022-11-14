import fetch from "node-fetch";

interface ConsultaVersionamento {
    id: string,
    numeroVersao: number,
    dataVersao: Date
}

interface ResetVersionamento {
    numeroVersao: number
}

export async function consultaVersionamento(): Promise<ConsultaVersionamento | undefined> {
    var params = new URLSearchParams();
    params.append("code", "YZrDC-oQKmhgNxjiI-EtvryTPsrDJ4r7FLUXCmgBwI9NAzFu8-rA_A==");
    params.append("namePackage", "GitFlow.Eleicoes");

    const response = await fetch("https://tlv7-versionamento.azurewebsites.net/api/ConsultaVersionamento", {
        headers: {
            "accountEndpoint": "https://usernosql.documents.azure.com:443/",
            "token": "sEpHfIs0BHC6wfE7swdbEGP4a4evFBud8k8m24VuvkIYV3b9eljtzMsbKvI9j2KyuFkHWjcktzHOACDbUr3O8w=="
        }
    });
    if (response.status == 200) {
        return await response.json() as ConsultaVersionamento;
    }

    return undefined;
}

export async function resetVersionamento(): Promise<void> {
    
}

consultaVersionamento()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log("error: " + err);
    });