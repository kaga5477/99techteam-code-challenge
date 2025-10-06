interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Add blockchain field
}

interface FormattedWalletBalance extends WalletBalance {
  // Extend existing interface
  formatted: string;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  // any => string
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20; // Both return 20
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props) => {
  const { ...rest } = props; // Remove children as it is not used
  const balances = useWalletBalances();
  const prices = usePrices();

  // Combine formatting into the same map operation
  const sortedAndFormattedBalances = useMemo(() => {
    return (
      balances
        .filter(
          (balance: WalletBalance) =>
            getPriority(balance.blockchain) > -99 && balance.amount > 0
        )
        // Cleaner and correct filtering logic
        .sort(
          (lhs: WalletBalance, rhs: WalletBalance) =>
            getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
        )
        // Cleaner sorting implementation and cover equal priorities case
        .map((balance: WalletBalance) => {
          return {
            ...balance,
            formatted: balance.amount.toFixed(2), // Use toFixed with a parameter for consistency
          } as FormattedWalletBalance; // Assert to the extended interface
        })
    );
  }, [balances]); // prices is not relevant in this memo

  const rows = sortedAndFormattedBalances.map(
    (balance: FormattedWalletBalance) => {
      // Correct variable
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // Use a stable unique key instead of index, assuming balance.currency is unique
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
