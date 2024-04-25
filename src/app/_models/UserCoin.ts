export class UserCoin {
    symbol!: string;
    totalAmount!: number;
    roi!: number;

    constructor(symbol: string, totalAmount: number, roi: number){
        this.symbol = symbol;
        this.totalAmount = totalAmount;
        this.roi = roi;
    }
}