import React from "react";
import { DataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
// import Home from "./Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./pages/Home";
import ThemeWrapper from "./components/wrapper/ThemeWrapper";


const query = {
  me: {
    resource: "me",
  },
};

const MyApp = () => {

  return (
    <Provider store={store}>
      <div className="w-100 overflow-x-hidden" >
        <DataQuery query={query}>
          {({ error, loading, data }) => {
            if (error) return <span>ERROR</span>;
            if (loading) return <span>...</span>;
            return (
              <>
                <ThemeWrapper>
                  <Home />
                </ThemeWrapper>
              </>
            );
          }}
        </DataQuery>
      </div>
    </Provider>
  )
};

export default MyApp;
