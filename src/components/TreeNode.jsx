import React, { useState } from "react";
import styles from '../App.module.css';

function TreeNode({ node }) {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className={styles.tree-node}>
      <span onClick={() => setIsOpen(!isOpen)}>
        {node.children ? (isOpen ? "▼" : "▶") : "•"}
      </span>
      <span>{node.name}</span>
      {node.children && isOpen && (
        <div style={{ paddingLeft: "20px" }}>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeNode;