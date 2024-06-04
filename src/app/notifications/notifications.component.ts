import { Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { Alert } from '../_models/Alert';
import { DynamicCurrencyPrecisionPipe } from '../_helpers/dynamic-currency-precision.pipe';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent  {
  @Output() alertDeletedEvent: EventEmitter<number> = new EventEmitter<number>();
  @Input() alerts:Set<Alert> = new Set<Alert>();

  constructor(private currencyPipe: DynamicCurrencyPrecisionPipe) {}

  isUp(initialPrice: number, alertPrice: number){
    return initialPrice < alertPrice;
  }

  alertMessage(symbol: string, initialPrice: number, alertPrice: number){
    return `price has ${this.isUp(initialPrice, alertPrice) ? 'increased' : 'decreased'}` 
            + ` from ${this.currencyPipe.transform(initialPrice)} to ${this.currencyPipe.transform(alertPrice)}`;
  }

  deleteAlert(id: number){
    for(const alert of this.alerts){
      if(alert.id === id) {
        this.alerts.delete(alert);
        break;
      }
    }
    this.alertDeletedEvent.emit(id);
  }

  deleteAll(){
    this.alerts = new Set<Alert>();
    this.alertDeletedEvent.emit(-1);
  }

}
