
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setTitle } from '../../store/sidebar/sidebar.action';
import { setPeriod, setSelectedDataset, setStatus, setUseSelectedUnitOnly } from '../../store/main/main.action';

const Sidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const links = [
        { to: '/', text: 'Data Set Report' },
        { to: '/report', text: 'Reporting Rate Summary' },
    ];

    useEffect(() => {
        setActiveLink(location.pathname);
        const activeLinkText = links.find(link => link.to === location.pathname)?.text || '';
        dispatch(setTitle({ href: location.pathname, text: activeLinkText }));
    }, [location]);

    function handleDataSet() {
        console.log('side bar clicked....................................');
    }

    const sidebarStyle = {
        backgroundColor: 'rgb(243, 243, 243)',

        width: '15%',
        height: '100vh',
        float:'left',
        boxSizing:'border-box',


        left: 0,
    };

    const linkStyle = {
        border: '10px',
        boxSizing: 'border-box',
        display: 'block',
        fontFamily: 'Roboto, sans-serif',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        cursor: 'pointer',
        textDecoration: 'none',
        margin: '0 8px',
        padding: 0,
        outline: 'none',
        fontSize: '14px',
        fontWeight: 'inherit',
        position: 'relative',
        color: 'rgba(0, 0, 0, 0.87)',
        lineHeight: '16px',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        borderRadius: '5px',
        background: 'none'
    };

    const linkContentStyle = {
        marginLeft: 0,
        padding: '16px 16px 16px 10px',

    };

    const activeLinkStyle = {
        ...linkStyle,
        backgroundColor: '#d63384',
        color: 'white'
    };

    return (
        <div style={sidebarStyle}>
            {links.map((link, index) => (
                <div key={index} style={{ backgroundColor: 'transparent', marginTop: '16px' }}>
                    <Link
                        to={link.to}
                        style={activeLink === link.to ? activeLinkStyle : linkStyle}
                        onClick={() => {
                            setActiveLink(link.to);
                            handleDataSet()
                        }}
                    >
                        <div>
                            <div style={linkContentStyle}>
                                <div>{link.text}</div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;


