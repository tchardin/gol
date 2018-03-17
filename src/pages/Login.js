import React from 'react'
import {Redirect} from 'react-router-dom'
import {Connect} from 'uport-connect'

import Button from '../components/Button'

class Login extends React.Component {
  state = {
    error: null
  }
  componentWillMount() {
    this.uport = new Connect('Game of Loans', {network: 'rinkeby'})
  }
  componentDidMount() {
    this.uport.requestCredentials().then(creds => {
      console.log(creds)
    })
    .catch(err => this.setState({ error: true }))
  }
  render() {
    if (this.state.error) {
      return <Redirect to="/"/>
    }
    return (
      <div className="login-container">
        {/*<Button>
          Login with uport
        </Button>*/}
      </div>
    )
  }
}

export default Login
