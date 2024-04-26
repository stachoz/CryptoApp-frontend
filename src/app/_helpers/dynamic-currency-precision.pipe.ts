import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicCurrencyPrecision'
})
export class DynamicCurrencyPrecisionPipe implements PipeTransform {

  transform(value: any) : string {
    const numericValue: number = Number(value); 
    let formatted = '';
    if(Math.abs(numericValue) >= 1000) {
      formatted = numericValue.toFixed(2);
    } else if(Math.abs(numericValue) >= 0.001) {
      formatted = numericValue.toFixed(3);
    } else {
      formatted = numericValue.toFixed(6);
    }
    return "$" + formatted;
  }

}
