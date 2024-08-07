import { Pipe, PipeTransform } from '@angular/core';
import { PivotType } from 'src/app/models/api.types';

@Pipe({
  name: 'pivot'
})
export class PivotPipe implements PipeTransform {
  //[country, HsCode, company]
  // ValueInUSD
  // HsCode
  // CountryofOrigin   CountryofDestination
  // Exp_Name
  transform(dataArr:any[], keysOrder:PivotType):Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const {keysArr, direction} = keysOrder;
        const loopLen = dataArr.length;
        const pivotStructure = {value: 0};
        const [level1, level2, level3] = [
          this.getActualDataKey(keysArr[0], direction),
          this.getActualDataKey(keysArr[1], direction),
          this.getActualDataKey(keysArr[2], direction)
        ];
  
        for(let i=0; i<loopLen; i++) {
          const data = dataArr[i];
          pivotStructure["value"] += Number(data["ValueInUSD"]);
          
          if(pivotStructure.hasOwnProperty(data[level1])) {
            pivotStructure[data[level1]]["value"] += Number(data["ValueInUSD"]);

            if(pivotStructure[data[level1]].hasOwnProperty(data[level2])) {
              pivotStructure[data[level1]][data[level2]]["value"] += Number(data["ValueInUSD"]);
              
              if(pivotStructure[data[level1]][data[level2]].hasOwnProperty(data[level3])) {
                pivotStructure[data[level1]][data[level2]][data[level3]] += Number(data["ValueInUSD"]);
              } else {
                pivotStructure[data[level1]][data[level2]][data[level3]] = Number(data["ValueInUSD"]);
              }

            } else {
              pivotStructure[data[level1]][data[level2]] = {value: Number(data["ValueInUSD"])};
              pivotStructure[data[level1]][data[level2]][data[level3]] = Number(data["ValueInUSD"]);
            }
            
          } else {            
            pivotStructure[data[level1]] = {value: Number(data["ValueInUSD"])};
            pivotStructure[data[level1]][data[level2]] = {value: Number(data["ValueInUSD"])};
            pivotStructure[data[level1]][data[level2]][data[level3]] = Number(data["ValueInUSD"]);
          }          
        }     
        
        return resolve(pivotStructure);
      } catch (error) {
        return reject(error);
      }
    });
  }


  getActualDataKey(orderkey:string, direction:string):string {
    const countryKey = direction=="import" ? "CountryofOrigin" : "CountryofDestination";
    const companyKey = direction=="import" ? "Exp_Name" : "Imp_Name";
    const keyName = orderkey=="country" ? countryKey : orderkey=="company" ? companyKey : orderkey; 
    return keyName;
  }  
}
