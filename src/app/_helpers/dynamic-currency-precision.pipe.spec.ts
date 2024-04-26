import { DynamicCurrencyPrecisionPipe } from './dynamic-currency-precision.pipe';

describe('DynamicCurrencyPrecisionPipe', () => {
  it('create an instance', () => {
    const pipe = new DynamicCurrencyPrecisionPipe();
    expect(pipe).toBeTruthy();
  });
});
