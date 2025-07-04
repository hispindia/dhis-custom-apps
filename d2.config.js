/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    name: 'birth-death-certificate',
    title: 'Birth & Death Certificate',
    type: 'app',


    entryPoints: {
        app: './src/App.jsx',
    },

    direction: 'auto',
}

module.exports = config
