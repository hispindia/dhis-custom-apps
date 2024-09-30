import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickedOU, setFilteredOU } from "../../store/outree/outree.action";

const OrgUnitChildren = ({ orgUnit, display, path }) => {
  const dispatch = useDispatch();

  const ouList = useSelector((state) => state.outree.ouList);
  const clickedOU = useSelector((state) => state.outree.clickedOU);

  const [pathId, setPathId] = useState(path);
  const [currentOU, setCurrentOU] = useState(orgUnit);
  const [displayChildren, setDisplayChildren] = useState(display);

  useEffect(() => { setPathId(path)}, [path] )
  useEffect(() => {
    if (pathId) {
      var path = pathId.split("/");
      if (!path[0]) {
        let hasParent = path.indexOf(currentOU.id);
        path.shift();
        path = (hasParent!='-1') ? path.slice(hasParent-1) : path;
        if (currentOU.id != path[0]) path.shift();
      }
      if (currentOU.id == path[0]) {
        if (path.length == 1) dispatch(setClickedOU(currentOU));
        else {
          path.shift();
          path = path.join("/");
          setPathId(path);
          setDisplayChildren(true);
        }
      }
    }
  }, [pathId]);

  useEffect(() => {
    if (orgUnit && ouList.length) {
      const currentOU = ouList.filter((ou) => orgUnit.id == ou.id);
      setCurrentOU(currentOU[0]);
    }
  }, [orgUnit, ouList]);

  const handleOUClick = () => {
    dispatch(setFilteredOU(""));
    setDisplayChildren(!displayChildren);
    dispatch(setClickedOU(currentOU));
  };

  const isClicked = clickedOU && currentOU.id == clickedOU.id ? true : false;

  return (
    <div>
      <>
        <h6
          className={isClicked ? "ou ou-clicked" : "ou fw-normal"}
          onClick={handleOUClick}
        >
          {(currentOU.children && currentOU.children.length) ? (displayChildren ? <span>&#9662;</span> : <span>&#9656;</span>) : ''}
          {currentOU.name}
        </h6>

        <ul className="ps-4">
          {displayChildren && currentOU.children
            ? currentOU.children
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((orgUnit) => (
                  <li key={orgUnit.id}>
                    {
                      <OrgUnitChildren
                        orgUnit={orgUnit}
                        display={false}
                        path={pathId}
                      />
                    }
                  </li>
                ))
            : ""}
        </ul>
      </>
    </div>
  );
};

export default OrgUnitChildren;
