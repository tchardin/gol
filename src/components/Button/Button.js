/* @flow */
import * as React from 'react'
import PropTypes from 'prop-types'
import cn from '../utils/classnames'
import './Button.css'

type Props = {
  className?: string,
  children?: React.Node,
  disabled: bool,
  href?: string,
  kind: string,
  small: boolean,
  tabIndex: number,
  type: string
}

class Button extends React.PureComponent<Props> {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    kind: PropTypes.oneOf([
      'primary',
      'secondary'
    ]),
    small: PropTypes.bool,
    tabIndex: PropTypes.number,
    type: PropTypes.oneOf([
      'button',
      'reset',
      'submit'
    ]),
  }
  static defaultProps = {
    disabled: false,
    kind: 'primary',
    small: false,
    tabIndex: 0,
    type: 'button'
  }
  render() {
    const {
      className,
      children,
      disabled,
      href,
      kind,
      small,
      tabIndex,
      type,
      ...other
    } = this.props
    const buttonClasses = cn(className, {
      'btn': true,
      'btn--sm': small,
      'btn--primary': kind === 'primary',
      'btn--secondary': kind === 'secondary'
    })
    const commonProps = {
      tabIndex,
      className: buttonClasses
    }
    const button = (
      <button
        {...other}
        {...commonProps}
        disabled={disabled}
        type={type}>
        {children}
      </button>
    )
    const anchor = (
      <a {...other}
        {...commonProps}
        href={href}
        role="button">
        {children}
      </a>
    )
    return href ? anchor : button
  }
}

export default Button
