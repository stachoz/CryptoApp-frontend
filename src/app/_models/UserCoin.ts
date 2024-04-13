export class UserCoin {
    symbol!: string;
    quantity!: number;

    constructor(symbol: string, quantity: number){
        this.symbol = symbol;
        this.quantity = quantity;
    }
}