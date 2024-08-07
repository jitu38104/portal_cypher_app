export class CountryHeads {
    India = {
        import: {
            Date: "DATE",
            HsCode: "TARIFF CODE",
            ProductDesc: "ITEM DESCRIPTION",
            Exp_Name: "SUPPLIER",
            Imp_Name: "BUYER",
            CountryofOrigin: "COUNTRY",
            uqc: "UQC",
            Mode: "MODE",
            Quantity: "QTY",
            Currency: "CURRENCY",
            UnitPriceFC: "UNT PRICE FC",
            InvValueFC: "EST VALUE FC",
            Duty_USD: "TAX US$ + OTHER CHARGES",
            Duty_PCNTG: "TAX %",
            Exchange_Rate: "EXCHANGE RATE",
            Importer_Value_USD: "TOTAL VALUE US$",
            ValueInUSD: "EST VALUE US$",
            PortofOrigin: "LOADING POINT",
            PortofDestination: "DISCHARGE POINT"
        },    
        export: {
            Date: "DATE",
            HsCode: "TARIFF CODE",
            ProductDesc: "ITEM DESCRIPTION",
            Exp_Name: "VENDOR",
            Imp_Name: "BUYER",
            CountryofDestination: "COUNTRY",
            uqc: "UQC",
            Mode: "MODE",
            Quantity: "QTY",
            Currency: "CURRENCY",
            UnitPriceFC: "UNT PRICE FC",
            InvValueFC: "EST_VALUE FC",
            ValueInUSD: "EST_VALUE US$",
            Exchange_Rate: "EXCHANGE RATE",
            PortofDestination: "DISCHARGE POINT",
            PortofOrigin: "LOADING POINT"
        }
    };
    Srilanka = { import: {}, export: {} };
    Philip = { import: {}, export: {} };
    Ethiopia = { import: {}, export: {} };
    Chile = { import: {}, export: {} };
    Russia = { import: {}, export: {} };
    Turkey = { import: {}, export: {} };
    Bangladesh = { import: {}, export: {} };
    Lesotho = { import: {}, export: {} };
    Usa = { import: {}, export: {} };
    Nigeria = { import: {}, export: {} };
    Vietnam = { import: {}, export: {} };
    Mexico = { import: {}, export: {} };
    Kenya = { import: {}, export: {} };
    Columbia = { import: {}, export: {} };
    Paraguay = { import: {}, export: {} };
    Peru = { import: {}, export: {} };
    Uganda = { import: {}, export: {} };
    Brazil = { import: {}, export: {} };
    Pakistan = { import: {}, export: {} };
    Namibia = { import: {}, export: {} };
    Ecuador = { import: {}, export: {} };

    countryLogs = {
        India: this.India,
        Srilanka: this.Srilanka,
        Ethiopia: this.Ethiopia,
        Chile: this.Chile,
        Philip: this.Philip,
        Bangladesh: this.Bangladesh,
        Turkey: this.Turkey,
        Russia: this.Russia,
        Lesotho: this.Lesotho,
        Usa: this.Usa,
        Nigeria: this.Nigeria,
        Vietnam: this.Vietnam,
        Mexico: this.Mexico,
        Kenya: this.Kenya,
        Columbia: this.Columbia,
        Paraguay: this.Paraguay,
        Peru: this.Peru,
        Uganda: this.Uganda,
        Brazil: this.Brazil,
        Pakistan: this.Pakistan,
        Namibia: this.Namibia,
        Ecuador: this.Ecuador
    }

    fetchCountryHeads(country:string) {
        return this.countryLogs[country];
    }
}

