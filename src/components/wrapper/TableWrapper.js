import React from 'react'
import { useSelector } from 'react-redux'
import classes from '../.././App.module.css';

export function TableWrapperTH({ children }) {
  const { value: themeValue } = useSelector(state => state.theme)

  return (
    <th className={`${themeValue ? classes["dark-mode"] : classes["light-mode"]} text-nowrap`}>{children}</th>
  )
}

export function TableWrapperTR({ children }) {
  return (
    <tr className="text-center">{children}</tr>
  )
}

export function TableWrapperTD({ children, style = {}, ...rest }) {
  const { value: themeValue } = useSelector(state => state.theme)

  return (
    <td {...rest} style={{ ...style }} className={`${themeValue ? classes["dark-mode"] : classes["light-mode"]} text-nowrap`}>{children}</td>
  )
}
