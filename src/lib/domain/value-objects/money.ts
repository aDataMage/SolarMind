export class Money {
    constructor(public amount: number, public currency: string = 'USD') { }

    toString() {
        return `${this.currency} ${this.amount.toFixed(2)}`;
    }
}
