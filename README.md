## Game of Loans - MIT Bitcoin Hackathon

This hack uses:
- The Dharma Protocol smart contracts and migrations tooling
- The `dharma.js` client development libraries
- React + Webpack
- IPFS - JS library
- Uport for authentication (Uport app currently not working).
- The `truffle` Ethereum development framework.

### Setup
---------------
##### Dependencies

Must have `node` installed with version `>= 7.5.0`.

Install dependencies:
```
yarn
```

##### Compile & Migrate Contracts

Start `testrpc`:
```
ganache-cli
```
Compile Dharma smart contracts:
```
yarn compile
```
Deploy Dharma smart contracts on to `testrpc`:
```
yarn migrate
```

##### Start Server
Start development server and visit the site at `http://localhost:3000`
```
yarn start
```
