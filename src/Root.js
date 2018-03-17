import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './pages/Home'
import './index.css'

const Root = () => (
  <Router>
    <Route path="/" component={Home}/>
  </Router>
)

export default Root
