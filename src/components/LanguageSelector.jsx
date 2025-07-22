import React, { useEffect } from 'react';
import '../App.module.css';
import { useTranslation } from 'i18next';
import { languages } from 'i18next';

const Languages = [
    {code: "br", lang: "Burmese"},
    {code: "en", lang: "English"}
]

const LanguageSelector = () => {

    const { i18n } = useTranslation();

    useEffect(() => {
        console.log(i18n.dir());
        document.body.dir = i18n.dir();

    }, [i18n, i18n.Languages])

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    }


    return (
        <div className='btn-container'>
            {
                languages.map((lng, code) => (
                    <button className={lng.code === i18n.language ? "selected": ""} key={code} onClick={() => changeLanguage(lng.code)}></button>
                ))
            }
        </div>
    )

}


export default LanguageSelector;