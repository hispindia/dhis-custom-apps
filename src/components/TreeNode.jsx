import React, { useState } from "react";
import styles from '../App.module.css';

function TreeNode({ node, orgUnits, setOrgUnit }) {
  const [isOpen, setIsOpen] = useState(false);

  const children = orgUnits.find(orgUnit=> orgUnit.id == node.id)?.children.sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.tree-node}>
      <div 
        style={{cursor: children.length ? "pointer" : "default", display:"flex", alignItems: "center"}}
        onClick={() => {
          if(children.length) setIsOpen(!isOpen);
          setOrgUnit(node);
        }}
      >

        <span style={{marginRight: 6}}>
          {children.length ? (isOpen ? "▼" : "▶") : "•"}
        </span> 

       <span>{node.name}</span>

      </div>
     
     {children.length && isOpen && (
      <div style={{paddingLeft: "20px"}}>
          {children.map((child) => (
            <TreeNode key={child.id} node={child} orgUnits={orgUnits} setOrgUnit={setOrgUnit}/>
          ))}
      </div>

     )}

    </div>
  );
}

export default TreeNode;