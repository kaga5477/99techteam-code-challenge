# Messy React

## Computational inefficiencies and anti-patterns

1. `WalletBalance` is missing the blockchain field which is accessed by `balance.blockchain` in `sortedBalances` function.
2. `FormattedWalletBalance` could extend `WalletBalance` and add `formatted` field.
3. `getPriority(blockchain: any)` uses `any`. Replace `any` with `string`.
4. Moved `getPriority` outside the component to avoid re-rendering many times.
5. Remove `children` as it is not used.
```const { children, ...rest } = props; ```

6. Undefined `lhsPriority` variable in filter.
```
...
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {
...
```
7. Filtering logic is wrong. Should be `balance.amount > 0`.
8. Sorting logic has not covered equal case.
9. The code first creates `formattedBalances` by mapping over `sortedBalances`, and then it creates rows by mapping over `sortedBalances` again while `WalletRow` needs `formattedBalances`. We could combine the sorting and formatting into a single map operation and correct the row mapping with one and only `sortedAndFormattedBalances`.
```
const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
    // ...
}, [balances, prices]);

const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
        ...balance,
        formatted: balance.amount.toFixed()
    }
})

const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => { // should be formattedBalances
    const usdValue = prices[balance.currency] * balance.amount;
    return (
        <WalletRow 
        // ...
```
10. `prices` is not relevant in the useMemo, should be removed from dependency.
11. Should not use `index` as a `key`. If the `sortedBalances` array changes (filtering, reordering,..), it might not correctly identify which items have changed, leading to unexpected UI behavior, performance issues, or bugs in child components.