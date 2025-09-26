export const ApiService = {
 
  getUserrole,
  getUserGroup,
  createUser,
  MeJson
 
};

async function MeJson() {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/me.json?fields=id,name,userRoles[id,name]`;
  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.text();
    return data;
  } else {
    throw "Error: Report generation failed, Please try again!";
  }
}
async function getUserrole() {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/userRoles.json?fields=name,id&paging=false`;

  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.text();
    return data;
  } else {
    throw "Error: Report generation failed, Please try again!";
  }
}
async function getUserGroup() {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/userGroups.json?fields=name,id&paging=false`;

  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.text();
    return data;
  } else {
    throw "Error: Report generation failed, Please try again!";
  }
}


async function createUser(formData) {
  const url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/users`;

  try {
    let response = await fetch(url, {
      method: "POST",
      credentials: "include", // keep if you need cookies/session
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData), // send your formData payload
    });

    // ✅ Handle error responses gracefully
    if (!response.ok) {
      let errorMsg = `Error ${response.status}: Unknown error`;

      try {
        const errorData = await response.json();

        if (
          errorData.response &&
          errorData.response.errorReports &&
          errorData.response.errorReports.length > 0
        ) {
          errorMsg = errorData.response.errorReports[0].message;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        }
      } catch (parseError) {
        // fallback if response is not JSON
        const errorText = await response.text();
        errorMsg = `Error ${response.status}: ${errorText}`;
      }

      throw new Error(errorMsg);
    }

    // ✅ Success response
    return await response.json();
  } catch (error) {
    console.error("❌ User creation failed:", error.message);
    throw error;
  }
}
