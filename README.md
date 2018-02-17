<img src="https://s3-us-west-2.amazonaws.com/dharma-assets/logo+orange.png"  width=300/>

------------

## Dharma Protocol React Starter Kit

This repository contains all the tools you need to quickly start hacking an application on top of Dharma protocol.

The starter kit ships with:
- The Dharma Protocol smart contracts and migrations tooling
- The `dharma.js` client development libraries
- React + Webpack
- The `truffle` Ethereum development framework.
- A simple application that demonstrates how to generate a signed, loan request using the `dharma.js` development libraries.

We recommend brushing up on the basics of Dharma protocol before diving in -- a non-techincal primer can be found [here](https://blog.dharma.io/dharma-protocol-in-a-nutshell-a7abcc716429).  For a deeper dive, study the [Dharma whitepaper](https://whitepaper.dharma.io).

[Join us on our chat](https://chat.dharma.io) for any technical or general questions.

> [Dharma](https://dharma.io) is a protocol for generic tokenized debt issuance and fundraising on blockchains supporting requisite smart contract functionality (i.e. EVM blockchains).  For a full description of the protocol's mechanics, a thorough overview can be found in the [Dharma Protocol Whitepaper](https://whitepaper.dharma.io/).  

### Setup
---------------
##### Dependencies

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
