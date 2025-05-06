import React from 'react';
import { useSelector } from 'react-redux';
import classes from '../.././App.module.css';

function ThemeWrapper({ children }) {
    const themeValue = useSelector(state => state.theme?.value);

    return (
        <div className={themeValue ? classes["dark-mode"] : classes["light-mode"]}>
            {children}
        </div>
    );
}

export default ThemeWrapper;
