import React from 'react'
import PropTypes from 'prop-types'
import { Route, Link } from 'react-router-dom'
import './pages.css'

import IPFS from 'ipfs'

//import Button from '../components/Button'
import DharmaApp from '../App'
import LoanRequestForm from '../components/LoanRequestForm'
import Login from './Login'
import Listing from './Listing'

class Home extends React.Component {
  state = {
    path: null,
    loanRequests: [],
    loanOrders: [],
    selected: {}
  }
  static childContextTypes = {
    ipfsNode: PropTypes.instanceOf(Object)
  }
  getChildContext() {
    return {
      ipfsNode: new IPFS({ repo: String(Math.random() + Date.now())})
    }
  }
  addLoanRequest = loanReq => {
    this.setState(prevState => ({
      loanRequests: prevState.loanRequests.concat([loanReq])
    }))
  }
  addLoanOrder = loanOrd => {
    this.setState(prevState => ({
      loanOrders: prevState.loanOrders.concat([loanOrd])
    }))
  }
  selectRequest = loan => {
    this.setState({
      selected: loan
    })
  }
  render() {
    const {
      loanRequests,
      loanOrders,
      selected
    } = this.state
    return (
      <div className="home">
        <nav className="nav">
          <div className="nav-left">
            <div className="nav-item">
              <Link to="/">
                <h1 className="title">Game of Loans</h1>
              </Link>
            </div>
          </div>
          <div className="nav-right">
            <div className="nav-item">
              <Link to="/underwriter" className="nav-link">Become an underwriter</Link>
            </div>
            <div className="nav-item">
              <Link to="/login" className="nav-link is-main">Sign in</Link>
            </div>
          </div>
        </nav>
        <Route exact path="/" component={() => <Listing requests={loanRequests} orders={loanOrders} selectRequest={this.selectRequest}/>}/>
        <Route path="/borrow" component={({history}) => <LoanRequestForm onSubmit={this.addLoanRequest} history={history}/>}/>
        <Route path="/login" component={Login}/>
        <Route path="/underwriter" component={() => <DharmaApp onSubmit={this.addLoanOrder} selected={selected}/>}/>
      </div>
    )
  }
}

export default Home
