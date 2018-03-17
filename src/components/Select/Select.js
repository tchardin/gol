import PropTypes from 'prop-types';
import React from 'react';
import classNames from '../utils/classnames';
import './Select.css'

export const SelectItem = ({ className, value, disabled, hidden, text, ...other }) => {
  const selectItemClasses = classNames({
    'select-option': true,
    [className]: className,
  });

  return (
    <option
      {...other}
      className={selectItemClasses}
      value={value}
      disabled={disabled}
      hidden={hidden}>
      {text}
    </option>
  );
};

SelectItem.propTypes = {
  value: PropTypes.any.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

SelectItem.defaultProps = {
  disabled: false,
  hidden: false,
  value: '',
  text: '',
};

const Select = ({
  className,
  id,
  inline,
  labelText,
  disabled,
  children,
  iconDescription,
  hideLabel,
  ...other
}) => {
  const selectClasses = classNames({
    'select': true,
    'select--inline': inline,
    [className]: className,
  });
  const labelClasses = classNames('label', {
    'visually-hidden': hideLabel,
  });
  return (
    <div className="form-item">
      {!inline ? (
        <label htmlFor={id} className={labelClasses}>
          {labelText}
        </label>
      ) : null}
      <div className={selectClasses}>
        {inline ? (
          <label htmlFor={id} className={labelClasses}>
            {labelText}
          </label>
        ) : null}
        <select
          {...other}
          id={id}
          className="select-input"
          disabled={disabled}>
          {children}
        </select>
      </div>
    </div>
  );
};

Select.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.any,
  iconDescription: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
};

Select.defaultProps = {
  disabled: false,
  labelText: 'Select',
  inline: false,
  iconDescription: 'open list of options',
};

export default Select;
