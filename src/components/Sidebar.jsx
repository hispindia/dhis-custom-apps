
import React, { useEffect, useState } from "react";
import TreeNode from "./TreeNode";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem, ListItemText } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Sidebar = ({orgUnit, setOrgUnit, userOrgunit, orgUnits}) => {

    const [selectedOrgUnitId, setSelectedOrgUnitId] = useState(null);
    const [selectedTab, setSelectedTab] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      if( localStorage.getItem('orgUnit')) {
      const orgUnitLocal = JSON.parse(localStorage.getItem('orgUnit'));
        setOrgUnit(orgUnitLocal);
        setSelectedOrgUnitId(orgUnitLocal.id)
      }
      else if(userOrgunit && userOrgunit.id){
        setOrgUnit(userOrgunit);
      }else if(orgUnits && orgUnits.length){
        setOrgUnit(orgUnits[0]);
      }
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
    <>
      <div className="card">
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
      }>
          <MenuItem onClick={() => handleMenuClose("/born-alive")}>
            <ListItemText>Live Birth</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose("/still-born")}>
            <ListItemText>Still Birth</ListItemText>
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
          path={orgUnit?.path || ''}
          orgUnits={orgUnits} 
          setOrgUnit={setOrgUnit}
          selectedOrgUnitId={selectedOrgUnitId}
          setSelectedOrgUnitId={setSelectedOrgUnitId}
        />
         : <p>Loading..</p>
         }
        </div>
      </div>
    </>
  );
}

export default Sidebar

