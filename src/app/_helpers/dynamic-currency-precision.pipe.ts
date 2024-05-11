import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicCurrencyPrecision'
})
export class DynamicCurrencyPrecisionPipe implements PipeTransform {

  transform(value: any) : string {
    const numericValue: number = Number(value); 
    let formattedPrecision = '';
    if(Math.abs(numericValue) >= 1000) {
      formattedPrecision = numericValue.toFixed(2);
    } else if(Math.abs(numericValue) >= 0.001) {
      formattedPrecision = numericValue.toFixed(3);
    } else {
      formattedPrecision = numericValue.toFixed(6);
    }
    let dotFormatted = this.numberDotFormat(formattedPrecision);
    return "$" + dotFormatted;
  }

  private numberDotFormat(value: string) : string {
    let dotIndex = value.indexOf(".");
    let toFormatPart = dotIndex != -1 ? value.substring(0, dotIndex) : value;
    let decimalPart = dotIndex != -1 ? value.substring(dotIndex) : "";

    if(toFormatPart.length >= 3){
      let formatted = "";
      for(let i = 0; i < toFormatPart.length; i++){
        formatted += toFormatPart[i];
        if(i !== toFormatPart.length - 1 && (toFormatPart.length - i - 1) % 3 === 0) formatted += ",";
      }
      return formatted += decimalPart;
    }
    return value;
  }
}
