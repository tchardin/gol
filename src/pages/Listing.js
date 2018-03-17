import React from 'react'
import {Link} from 'react-router-dom'
import {Card, CardContent} from '../components/Card'
import ph from '../components/Card/woman.png'
import Button from '../components/Button'

class Listing extends React.Component {
  render() {
    const {
      orders,
      requests,
      selectRequest
    } = this.props
    console.log(orders, requests)
    return (
      <div className="listing">
        <div className="requests-listing">
          {requests.map((r, i) => (
            <div className="card-outer" key={i}>
              <Link to="/underwriter"
                onClick={() => selectRequest(r)}>
                <Card>
                  <CardContent
                    cardImage={ph}
                    cardTitle={r.type}
                    cardInfo={[r.description]}
                    cardOwner={`${r.amount}${r.coin}`}
                    cardType={`${r.rate}%`}/>
                </Card>
              </Link>
            </div>
          ))}
          {requests.length &&
          <div className="card-outer">
            <Card>
              <Link to="/borrow" className="plus-button">
                <Button>
                  New Request
                </Button>
              </Link>
            </Card>
          </div>}
        </div>
        <div className="orders-listing">
          {/*orders.map((r, i) => (
            <div className="card-outer" key={i}>
              <Card>
                <CardContent
                  cardImage={ph}
                  cardTitle={}
              </Card>
            </div>
          ))*/}
          {(!requests.length && !orders.length) &&
            <Link to="/borrow" className="plus-button">
              <Button>
                Request a loan
              </Button>
            </Link>}
        </div>
      </div>
    )
  }
}

export default Listing
