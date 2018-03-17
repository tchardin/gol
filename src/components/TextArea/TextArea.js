/* @flow */
import * as React from 'react'
import PropTypes from 'prop-types'
import cn from '../utils/classnames'
import './TextArea.css'

type Props = {
  className?: string,
  cols: number,
  defaultValue?: string | number,
  disabled: boolean,
  hideLabel?: boolean,
  id?: string,
  invalid: boolean,
  invalidText: string,
  labelText: string,
  onChange: () => void,
  onClick: () => void,
  placeholder: string,
  rows: number,
  value?: string | number
}

class TextArea extends React.PureComponent<Props> {
  static propTypes = {
    className: PropTypes.string,
    cols: PropTypes.number,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    disabled: PropTypes.bool,
    hideLabel: PropTypes.bool,
    id: PropTypes.string,
    invalid: PropTypes.bool,
    invalidText: PropTypes.string,
    labelText: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  static defaultProps = {
    cols: 50,
    disabled: false,
    invalid: false,
    invalidText: '',
    onChange: () => {},
    onClick: () => {},
    placeholder: '',
    rows: 4
  }

  onChange = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    if (!this.props.disabled) {
      this.props.onChange(e)
    }
  }
  onClick = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    if (!this.props.disabled) {
      this.props.onClick(e)
    }
  }
  render() {
    const {
      className,
      hideLabel,
      id,
      invalid,
      invalidText,
      labelText,
      onChange,
      onClick,
      ...other
    } = this.props

    const textareaProps = {
      id,
      onChange: this.onChange,
      onClick: this.onClick
    }

    const label = labelText ? (
      <label
        htmlFor={id}
        className={cn('label', {
          'visually-hidden': hideLabel
        })}>
        {labelText}
      </label>
    ) : null

    const error = invalid ? (
      <div className="form-requirement">
        {invalidText}
      </div>
    ) : null

    const input = invalid ? (
      <textarea
        {...other}
        {...textareaProps}
        className={cn('text-area', className)}
        data-invalid/>
    ) : (
      <textarea
        {...other}
        {...textareaProps}
        className={cn('text-area', className)}/>
    )

    return (
      <div className="form-item">
        {label}
        {input}
        {error}
      </div>
    )
  }
}

export default TextArea
