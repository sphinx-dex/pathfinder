# Sphinx Pathfinder

### Packages

- `simulations`: scripts folder for calcuating routes.

- `ui`: example frontend showcasing how routing works and the impact it has in the total cost for a swap. Metrics considered: 

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