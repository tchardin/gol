import React, { Component } from 'react'
import PropTypes from 'prop-types'
import promisify from "tiny-promisify"
import Dharma from "@dharmaprotocol/dharma.js";
import BigNumber from "bignumber.js";

// import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Well } from "react-bootstrap";
import TextInput from './components/TextInput'
import Button from './components/Button'
import Select, {SelectItem} from './components/Select'


import DebtKernel from '../build/contracts/DebtKernel.json'
import DebtRegistry from '../build/contracts/DebtRegistry.json'
import RepaymentRouter from '../build/contracts/RepaymentRouter.json'
import TokenTransferProxy from '../build/contracts/TokenTransferProxy.json'
import TokenRegistry from '../build/contracts/TokenRegistry.json'
import DebtToken from '../build/contracts/DebtToken.json'
import TermsContractRegistry from "../build/contracts/TermsContractRegistry.json"

import getWeb3 from './utils/getWeb3'
const Buffer = require('buffer/').Buffer

class App extends Component {
  static contextTypes = {
    ipfsNode: PropTypes.instanceOf(Object)
  }
  constructor(props) {
    super(props)

    this.handlePrincipalAmountChange = this.handlePrincipalAmountChange.bind(this);
    this.handlePrincipalTokenChange = this.handlePrincipalTokenChange.bind(this);
    this.handleInterestRateChange = this.handleInterestRateChange.bind(this);
    this.handleInstallmentsTypeChange = this.handleInstallmentsTypeChange.bind(this);
    this.handleTermLengthChange = this.handleTermLengthChange.bind(this);

    this.onGenerateDebtOrder = this.onGenerateDebtOrder.bind(this);
    this.onSignDebtOrder = this.onSignDebtOrder.bind(this);
    this.onFillDebtOrder = this.onFillDebtOrder.bind(this);

    this.state = {
      storageValue: 0,
      web3: null,
      dharma: null,
      debtOrder: null,
      debtOrderSigned: false,
      principalAmount: "",
      interestRate: "",
      principalTokenSymbol: "",
      amortizationUnit: "hours",
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      selected: {amount,coin,rate}
    } = nextProps
    // const {
    //   principalAmount,
    //   interestRate,
    //   principalTokenSymbol
    // } = this.state
          this.setState({
            principalAmount: amount,
            principalTokenSymbol: coin,
            interestRate: rate
          })
        
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateDharma()
    })
    .catch((e) => {
      console.log('Error instantiating Dharma contracts:' + e);
    })
  }

  handlePrincipalAmountChange(e) {
      this.setState({
          principalAmount: e.target.value
      });
  }

  handlePrincipalTokenChange(e) {
      this.setState({
          principalTokenSymbol: e.target.value
      });
  }

  handleInterestRateChange(e) {
      this.setState({
          interestRate: e.target.value
      });
  }

  handleInstallmentsTypeChange(e) {
      this.setState({
          amortizationUnit: e.target.value
      });
  }

  handleTermLengthChange(e) {
      this.setState({
          termLength: e.target.value
      });
  }

  async onGenerateDebtOrder(e) {
      const { principalAmount, principalTokenSymbol, interestRate, amortizationUnit, termLength } = this.state;

      const dharma = this.state.dharma;

      const tokenRegistry = await dharma.contracts.loadTokenRegistry();
      const principalToken = await tokenRegistry.getTokenAddress.callAsync(principalTokenSymbol);

      const simpleInterestLoan = {
          principalToken,
          principalAmount: new BigNumber(principalAmount),
          interestRate: new BigNumber(interestRate),
          amortizationUnit,
          termLength: new BigNumber(termLength)
      };

      const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);

      this.setState({ debtOrder: JSON.stringify(debtOrder) });
  }

  async onSignDebtOrder(e) {
      if (!this.state.debtOrder) {
          throw new Error("No debt order has been generated yet!");
      }

      const debtOrder = JSON.parse(this.state.debtOrder);

      debtOrder.principalAmount = new BigNumber(debtOrder.principalAmount);
      debtOrder.debtor = this.state.accounts[0];

      // Sign as debtor
      const debtorSignature = await this.state.dharma.sign.asDebtor(debtOrder);
      const signedDebtOrder = Object.assign({ debtorSignature }, debtOrder);
      this.addIPFSFile(JSON.stringify(signedDebtOrder))
      this.setState({ debtOrder: JSON.stringify(signedDebtOrder), debtOrderSigned: true });
  }

  async onFillDebtOrder(e) {
      if (!this.state.debtOrder) {
          throw new Error("No debt order has been generated yet!");
      }

      const debtOrder = JSON.parse(this.state.debtOrder);

      debtOrder.principalAmount = new BigNumber(debtOrder.principalAmount);

      // Specify account that will be acting as the creditor in this transaction
      debtOrder.creditor = this.state.accounts[0];

      const { dharma } = this.state;

      const txHash = await dharma.order.fillAsync(debtOrder);

      await dharma.blockchain.awaitTransactionMinedAsync(txHash);

      const errors = await dharma.blockchain.getErrorLogs(txHash);

      console.log(errors);
  }

  async instantiateDharma() {
    const networkId = await promisify(this.state.web3.version.getNetwork)();
    const accounts = await promisify(this.state.web3.eth.getAccounts)();

    if (!(networkId in DebtRegistry.networks &&
          networkId in DebtKernel.networks &&
          networkId in RepaymentRouter.networks &&
          networkId in TokenTransferProxy.networks &&
          networkId in TokenRegistry.networks &&
          networkId in DebtToken.networks &&
          networkId in TermsContractRegistry.networks)) {
        throw new Error("Cannot find Dharma smart contracts on current Ethereum network.");
    }

    const dharmaConfig = {
        debtRegistryAddress: DebtRegistry.networks[networkId].address,
        kernelAddress: DebtKernel.networks[networkId].address,
        repaymentRouterAddress: RepaymentRouter.networks[networkId].address,
        tokenTransferProxyAddress: TokenTransferProxy.networks[networkId].address,
        tokenRegistryAddress: TokenRegistry.networks[networkId].address,
        debtTokenAddress: DebtToken.networks[networkId].address,
        termsContractRegistry: TermsContractRegistry.networks[networkId].address
    }

    const dharma = new Dharma(this.state.web3.currentProvider, dharmaConfig);

    this.setState({ dharma, accounts });
  }

  renderFillButton() {
      if (this.state.debtOrder && this.state.debtOrderSigned) {
          return (
              <Button
                bsStyle="primary"
                onClick={this.onFillDebtOrder}
              >
                Fill Debt Order
              </Button>
          )
      } else {
          return null;
      }
  }

  handleChange = ({target}) => {
    this.setState({
      [target.id]: target.value
    })
  }

  addIPFSFile = file => {
    const {ipfsNode} = this.context
    ipfsNode.files.add([Buffer.from(JSON.stringify(file))], (err, filesAdded) => {
      if (err) throw err

      const hash = filesAdded[0].hash
      ipfsNode.files.cat(hash, (err, data) => {
        if (err) throw err
        const catRes = JSON.parse(data.toString('utf8'))
        console.log(JSON.parse(catRes))
      })
    })
  }

  render() {
    const {
      principalAmount,
      interestRate,
      principalTokenSymbol
    } = this.state
    return (
      <div className="form-container">
        <div className="form-header">
          <h1 className="title">Create a debt order</h1>
        </div>
        <div className="form-body">
          <TextInput
            id="principalAmount"
            type="number"
            labelText="Principal Amount"
            placeholder="100"
            value={principalAmount}
            onChange={this.handleChange}/>
          <Select
            id="principalToken"
            labelText="Principal Token"
            value={principalTokenSymbol}>
            <SelectItem
              value="REP"
              text="Augur (REP)"/>
            <SelectItem
              value="MKR"
              text="Maker DAO (MKR)"/>
            <SelectItem
              value="ZRX"
              text="0x Token (ZRX)"/>
          </Select>
          <TextInput
            id="interestRate"
            type="number"
            labelText="Interest Rate"
            placeholder="8.12%"
            value={interestRate}
            onChange={this.handleChange}/>
          <Select
            id="installmentsType"
            labelText="Installment Type">
            <SelectItem
              value="hours"
              text="Hourly"/>
            <SelectItem
              value="days"
              text="Daily"/>
            <SelectItem
              value="weeks"
              text="weekly"/>
            <SelectItem
              value="months"
              text="Monthly"/>
            <SelectItem
              value="years"
              text="Yearly"/>
          </Select>
          <TextInput
            id="termLength"
            type="number"
            labelText="Term Length"
            placeholder="3"
            onChange={this.handleChange}/>
          <div className="form-nav">
            {this.state.debtOrder ? (
              <Button
                onClick={() => this.onSignDebtOrder()}>
                Sign Debt Order
              </Button>
            ) : (
              <Button
                onClick={() => this.onGenerateDebtOrder()}>
                Create Debt Order
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App
