import { Money } from '../value-objects/money';

export class PricingService {
    calculateTotal(price: Money, nights: number): Money {
        return new Money(price.amount * nights, price.currency);
    }
}
