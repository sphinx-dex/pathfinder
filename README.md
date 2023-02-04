# Sphinx Pathfinder

### Packages 

- `simulations`: scripts folder for calculating routes.

- `ui`: example frontend showcasing how routing works and the impact it has in the total cost for a swap. Metrics considered: 
  - **Original slippage on Jediswap**: Original slippage without applying routing.
  - **Slippage after routing optimization**: Slippage appliying routing.
  - **Slippage reduction**: Difference between original price impact and price impact applying routing. 
  - **Additional tokens gained**: The result difference when using routing optimization.

<div style='float: center'>
  <img style='width: 400px' src="packages/docs/uimetrics.png"></img>
</div>

---

In addition it shows a graph representing the routing proportion between the AMM and Orderbook.

<div style='float: center'>
  <img style='width: 400px' src="packages/docs/uigraph.png"></img>
</div>

### Route calculation

The application follows the following algorithm:

1. Find AMM pool address for token pair
2. Query AMM pool reserves
3. Query order book for token pair
4. Calculate the AMM output as a starting point
5. Iterating over the sorted order-book, add each order to the list of orders to execute and calculate the combined output
6. Once the algorithm reaches the point where a new order _decreases_ the output amount, run a binary-search to determine the amount for an optimum partial fill
7. Return the calculated route (orders to consume and amount to route to the AMM)

### Build

To build all apps and packages, run the following command:

```
cd pathfinder
yarn run build
```

### Develop

To run ui

```
cd pathfinder/packages/ui
yarn dev
```

To run simulation

```
cd pathfinder/packages/simulations
yarn ts-node simulate-testnet.ts
```