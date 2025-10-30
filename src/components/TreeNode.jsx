import React, { useState } from "react";
import styles from '../App.module.css';

function TreeNode({ node, orgUnits, setOrgUnit, selectedOrgUnitId,  setSelectedOrgUnitId }) {
  const [isOpen, setIsOpen] = useState(false);


  const children = orgUnits.find(orgUnit=> orgUnit.id == node.id)?.children.sort((a,b) => a.displayName.localeCompare(b.displayName));

  const isSelected = selectedOrgUnitId === node.id;

  return (
    <>
      <div 
        style={{
          cursor: children.length ? "pointer" : "default", 
          display:"flex", 
          alignItems: "center",
          backgroundColor: isSelected ? "#e0f7fa" : "transparent",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize:"13px",
        }}
        onClick={() => {
          if(children.length) setIsOpen(!isOpen);
          setOrgUnit(node);
          setSelectedOrgUnitId(node.id);
        }}
      >

        <span style={{marginRight: "6"}}>
          {children.length ? (isOpen ? "▼ " : "▶ ") : "• "}
        </span> 

       <span>{node.displayName}</span>

      </div>
     
     {(children.length && isOpen) ?(
      <div style={{paddingLeft: "20px"}}>
          {children.map((child) => (
            <TreeNode
             key={child.id} 
             node={child} 
             orgUnits={orgUnits} 
             setOrgUnit={setOrgUnit}
             selectedOrgUnitId={selectedOrgUnitId}
             setSelectedOrgUnitId={setSelectedOrgUnitId}
             />
          ))}
      </div>

     ): ''}

    </>
  );
}

export default TreeNode;