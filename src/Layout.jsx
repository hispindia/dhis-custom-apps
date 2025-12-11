import Dhis2HeaderBar from "./components/HeaderBar/HeaderBar.component"

const Layout = ({children}) => {
    return <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Dhis2HeaderBar title={'Birth & Death Certificate'} />
        
    <div style={{ flex: 1 }}>
        {children}
    </div>
    </div>
}

export default Layout;