import React from 'react'
import PropTypes from 'prop-types'
import {ProgressStep, ProgressIndicator} from './ProgressIndicator'
import {Redirect} from 'react-router-dom'
import Button from './Button'
import TextArea from './TextArea'
import TextInput from './TextInput'
import FileUploader from './FileUploader'
import Select, {SelectItem} from './Select'

const Buffer = require('buffer/').Buffer

class LoanRequestForm extends React.Component {
  static contextTypes = {
    ipfsNode: PropTypes.instanceOf(Object)
  }
  state = {
    index: 0,
    loanType: "",
    loanDescription: "",
    files: null,
    amount: 0,
    rate: 0,
    coin: null,
    submitted: false
  }
  componentDidMount() {
    this.context.ipfsNode.once('ready', () => {
      console.log('IPFS node ready.')
    })
  }
  handleChange = ({target}) => {
    this.setState({
      [target.id]: target.value
    })
  }
  handleNext = () => {
    this.setState(prevState => ({
      index: prevState.index += 1
    }))
  }
  handlePrevious = () => {
    this.setState(prevState => ({
      index: prevState.index -= 1
    }))
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const {
      loanType,
      loanDescription,
      files,
      amount,
      rate,
      coin
    } = this.state
    const loanRequest = {
      type: loanType,
      description: loanDescription,
      files,
      amount,
      rate,
      coin
    }
    const { ipfsNode } = this.context
    ipfsNode.files.add([Buffer.from(JSON.stringify(loanRequest))], (err, filesAdded) => {
      if (err) throw err

      const hash = filesAdded[0].hash
      ipfsNode.files.cat(hash, (err, data) => {
        if (err) throw err

        const catRes = JSON.parse(data.toString('utf8'))
        this.props.onSubmit(catRes)
        this.props.history.push('')
      })
    })
  }
  render() {
    const formBody = this.state.index === 0 ? (
      <div className="form-body">
        <TextInput
          id="loanType"
          labelText="Loan type"
          placeholder="Simple title..."
          onChange={this.handleChange}/>
        <TextArea
          id="loanDescription"
          labelText="Purpose for the loan"
          placeholder="Extended description..."
          onChange={this.handleChange}/>
      </div>
    ) : this.state.index === 1 ? (
      <div className="form-body">
        <div className="form-subtitle">
          Upload documents showing source of credit worthiness.
        </div>
        <FileUploader
          labelTitle="Upload"
          labelDescription="only .jpg and .png files at 500mb or less"
          buttonLabel="Add files"
          filenameStatus="edit"
          accept={[".jpg", ".png", ".pdf"]}
          multiple
          onChange={({target}) => this.setState({
            files: target.files
          })}
        />
      </div>
    ) : (
      <div className="form-body">
        <TextInput
          id="amount"
          type="number"
          placeholder="100"
          labelText="Amount"
          onChange={this.handleChange}/>
        <TextInput
          id="rate"
          type="number"
          placeholder="8.9%"
          labelText="Requested Rate"
          onChange={this.handleChange}/>
        <Select
          id="coin"
          labelText="Token"
          onChange={this.handleChange}>
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
      </div>
    )
    return (
      <div className="form-container">
        <div className="form-header">
          <ProgressIndicator currentIndex={this.state.index}>
            <ProgressStep
              label="Loan information"
              description="Why do you need this loan?"/>
            <ProgressStep
              label="Your credit"
              description="Are you trustworthy?"/>
            <ProgressStep
              label="Loan parameters"
              description="Financial parameters of your loan request."/>
          </ProgressIndicator>
        </div>
        {formBody}
        {this.state.index === 0 ? (
          <div className="form-nav">
            <Button
              onClick={this.handleNext}>
              Next
            </Button>
          </div>
        ) : this.state.index === 1 ? (
          <div className="form-nav">
            <Button
              kind="secondary"
              onClick={this.handlePrevious}>
              Back
            </Button>
            <Button
              onClick={this.handleNext}>
              Next
            </Button>
          </div>
        ) : (
          <div className="form-nav">
            <Button
              kind="secondary"
              onClick={this.handlePrevious}>
              Back
            </Button>
            <Button
              onClick={this.handleSubmit}>
              Submit
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default LoanRequestForm
