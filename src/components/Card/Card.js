/* @flow */
import * as React from 'react'
import PropTypes from 'prop-types'
import cn from '../utils/classnames'
import './Card.css'

type Props = {
  children?: React.Node,
  className?: string,
  tabIndex: number
}

class Card extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    tabIndex: PropTypes.number
  }
  static defaultProps = {
    tabIndex: 0
  }
  render() {
    const {
      children,
      className,
      tabIndex,
      ...other
    } = this.props
    return (
      <div
        {...other}
        className={cn("card", {
          [className]: className
        })}
        tabIndex={tabIndex}>
        {children}
      </div>
    )
  }
}

export default Card
