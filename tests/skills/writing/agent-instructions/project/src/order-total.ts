export function orderTotal(pricesInCents: number[]): number {
  return pricesInCents.reduce((sum, price) => sum + price, 0);
}
