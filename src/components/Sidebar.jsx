
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import TreeNode from "./TreeNode";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../App.module.css';
import { fetchOrgUnits } from "../API/OrganizationAPI";
import { Button, Menu, MenuItem, ListItemText, ListItemIcon } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const Sidebar = ({setOrgUnit, userOrgunit, orgUnits}) => {

    const[selectedOrgUnitId, setSelectedOrgUnitId] = useState(null);
    const[selectedTab, setSelectedTab] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {

      fetchOrgUnits().then(setOrgUnit);

    }, []);


    // opening the dropdown
    const handleMenuClick = (e) => {
       setAnchorEl(e.currentTarget);
    }

    // closing dropdown and going the selected page
    const handleMenuClose = (route) => {
        setAnchorEl(null);

        if(route){
          setSelectedTab(route);
          navigate(route);
        }

    };

  
   return (
    <div className={styles.sidebar}>
      <div className="card">
       {/* Birth Record dropDown */}

      <Button
        variant="outlined"
        endIcon={ <ArrowDropDownIcon />}
        onClick={handleMenuClick}
          sx={{
            marginBottom: "0.5rem",
            width: "100%",
            justifyContent: "space-between",
            backgroundColor:
              selectedTab === "/born-alive" || selectedTab === "/still-born"
                ? "#e0f7fa"
                : "transparent",
            border: selectedTab === "/born-alive" || selectedTab === "/still-born"
              ? "1px solid green"
              : "",
            textTransform: "none",
          }}

           >
          Birth Records
      </Button>

      <Menu anchorEl={anchorEl} 
      // {/* open={Boolean(anchorEl)} it is prop that controls the dropdown visibiltiy */}
      open={Boolean(anchorEl)}   
      onClose={() => handleMenuClose()}
      PaperProps={
        {
          style: {
            // cleintwidth get the widtht in pixel 
            width: anchorEl ? anchorEl.clientWidth : undefined
          },
        }
      }
      
      
      >
          <MenuItem onClick={() => handleMenuClose("/born-alive")}>
            <ListItemText>Live Birth</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose("/still-born")}>
            <ListItemText>Still Born</ListItemText>
          </MenuItem>
        </Menu>

       
        <Link to="/death"
         className="button"
        style={{ 
          display: "block",
          backgroundColor: selectedTab === "death" ? "#e0f7fa":"transparent",
          borderRadius: "4px",
          padding: "6px 10px",
          transition: "background-color 0.3s ease",
          border: selectedTab === "death" ? "1px solid green": "", 
          textDecoration: "none",   
          }}
          onClick={() => setSelectedTab("death")}
          >
          Death Records
        </Link> 
      </div>
      <div className="card">
        <h3>📁 Organization Unit Hierarchy</h3>
        <div id="orgTree" style={{overflow:"auto",height:"300px"}}>
         {
         userOrgunit ? 
        <TreeNode 
        node={userOrgunit}
        orgUnits={orgUnits} 
        setOrgUnit={setOrgUnit}
        selectedOrgUnitId={selectedOrgUnitId}
        setSelectedOrgUnitId={setSelectedOrgUnitId}
      />
         : <p>Loading..</p>
         }
        </div>
      </div>
      </div>
  );
}

export default Sidebar

