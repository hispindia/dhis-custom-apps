
import React, { useState, useEffect } from "react";
import { HeaderBar } from "@dhis2/ui-widgets";
import { CustomDataProvider, Provider } from "@dhis2/app-runtime";

const { VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD } = import.meta.env;

const createCustomData = ({ title, me, dashboard, modules }) => {
  const headerBarData = {
    "systemSettings/applicationTitle": {
      applicationTitle: title,
    },
    me,
    "action::menu/getModules": {
      modules,
    },
    "me/dashboard": dashboard,
  };
  return headerBarData;
};

const Dhis2HeaderBar = ({ title }) => {
  //   useEffect(() => {
  // metadataApi.getHeaderBarData().then((json) => {
  //   json.title = title;
  //   setData(json);
  // });
  //   }, []);

  return (
    <Provider config={{ apiVersion: "33", baseUrl: VITE_BASE_URL }}>
      {/* <CustomDataProvider data={createCustomData(data)}> */}
      <HeaderBar appName={title} apps={<div>ALo</div>} />
      {/* </CustomDataProvider> */}
    </Provider>
  );
};

export default Dhis2HeaderBar;