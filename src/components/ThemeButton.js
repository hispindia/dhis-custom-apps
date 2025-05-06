import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { themeManage } from '../redux/actions/ThemeActions';
import { SET_THEME } from '../constants';

function ThemeButton() {
    const dispatch = useDispatch()
    const [isChecked, setIsChecked] = useState(false);

    const handleSwitchChange = (event) => {
        setIsChecked(event.target.checked);
        dispatch(themeManage(event.target.checked))
    };

    useEffect(() => {
        const theme = localStorage.getItem(SET_THEME)
        const isDark = theme === "true";  // convert string to boolean
        console.log({ isDark })
        dispatch(themeManage(isDark))
        setIsChecked(isDark)
    }, [])

    // useEffect(() => {
    //     const theme = localStorage.getItem(SET_THEME);
    //     const isDark = theme === "true";  // convert string to boolean

    //     dispatch(themeManage(isDark));
    //     setIsChecked(isDark);
    // }, []);

    return (
        <div className="form-check form-switch">
            <input
                style={{ width: "60px", height: "25px" }}
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheckDefault"
                checked={isChecked}
                onChange={handleSwitchChange}
            />
            <label style={{ margin: '6px' }} className="form-check-label" htmlFor="switchCheckDefault">
                {isChecked ? 'Light Mode' : 'Dark Mode'}
            </label>
        </div>
    );
}

export default ThemeButton;
