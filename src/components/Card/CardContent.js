/* @flow */
import * as React from 'react'
import PropTypes from 'prop-types'
import cn from '../utils/classnames'

type Props = {
  cardImage: string,
  cardTitle: string,
  cardInfo: Array<string>,
  cardOwner: string,
  cardType: string,
  className: string,
}

const CardContent = ({
  cardImage,
  cardTitle,
  cardInfo,
  cardOwner,
  cardType,
  className,
  ...other
}: Props) => {
  const cardContentClasses = cn({
    'card-content': true,
    [className]: className
  })

  const cardImageContent = cardImage ? (
    <div
      role="img"
      aria-label={cardTitle}
      className="card-image"
      style={{backgroundImage: `url(${cardImage})`}}/>
  ) : null

  const cardInfoContent = cardInfo
    ? cardInfo.map((info, key) => (
      <p key={key} className="card-info">
        {info}
      </p>
    )) : ''

  return (
    <div {...other} className={cardContentClasses}>
      {cardImageContent}
      <div className="card-content-container">
        <p className="card-owner">
          {cardOwner}
        </p>
        <p className="card-title">
          {cardTitle}
        </p>
        {cardInfoContent}
        <hr/>
        <p className="card-type">
          {cardType}
        </p>
      </div>
    </div>
  )
}

CardContent.propTypes = {
  cardImage: PropTypes.string,
  cardTitle: PropTypes.string,
  cardInfo: PropTypes.array,
  cardOwner: PropTypes.string,
  cardType: PropTypes.string,
  className: PropTypes.string,
}

CardContent.defaultProps = {
  cardOwner: 'Unknown owner',
  cardTitle: 'Card Title',
  cardType: 'Card Type',
  //cardImage: ['placeholder image']
}

export default CardContent
