import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Alert } from '../_models/Alert';
import { DynamicCurrencyPrecisionPipe } from '../_helpers/dynamic-currency-precision.pipe';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  @Output() alertDeletedEvent: EventEmitter<number> = new EventEmitter<number>();
  @Input() alerts:Alert[] = [];

  constructor(private currencyPipe: DynamicCurrencyPrecisionPipe) {}

  isUp(initialPrice: number, alertPrice: number){
    return initialPrice < alertPrice;
  }

  alertMessage(symbol: string, initialPrice: number, alertPrice: number){
    return `price has ${this.isUp(initialPrice, alertPrice) ? 'increased' : 'decreased'}` 
            + ` from ${this.currencyPipe.transform(initialPrice)} to ${this.currencyPipe.transform(alertPrice)}`;
  }

  deleteAlert(id: number){
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.alertDeletedEvent.emit(id);
  }

  deleteAll(){
    this.alerts = [];
    this.alertDeletedEvent.emit(-1);
  }

}
