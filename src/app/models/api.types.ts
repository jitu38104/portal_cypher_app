export interface NewCompanyObj {
    company: String;
    userId: Number;
    dateTime: String;
}

export interface CompanyFetchBody {
    countryname: String;
    companyname: String;
    direction: String;
    sameCompanyCountry: Boolean;
}

export type ApiMsgRes = {
    error: Boolean;
    status: Number;
    code: Number;   
    message: String;
    msg: String;
    result: Array<any>;
    results: Array<any>;
}

export type PivotType = {
    keysArr: string[],
    direction: string
}

