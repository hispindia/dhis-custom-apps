const fetchWrapper = (...input) => {
  return new Promise((rs, rj) => {
    fetch(...input)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized");
          }
          throw response;
        }

        rs(response);
      })
      .catch((err) => {
        console.log(err);
        if (err.message === "Unauthorized") {
          alert("Session expired. Please login again.");
          window.location.href = "../../../dhis-web-commons-security/logout.action";
        }
        rj(err);
      });
  });
};

const get = (baseUrl, username, password, endPoint, params, pagingObject) => {
  const { paging, pageSize, totalPages, page, filter, order, skipPaging = false } = pagingObject ? pagingObject : {};

  endPoint += "?";
  if (filter) {
    endPoint += `${filter}&`;
  }
  if (order) {
    endPoint += `${order}&`;
  }
  if (paging) {
    endPoint += `paging=true&pageSize=${pageSize}&page=${page}&`;
    if (totalPages) {
      endPoint += `totalPages=${totalPages}&`;
    }
  } else {
    endPoint += "paging=false&";
  }

  if (params) {
    endPoint += params.join("&");
  }

  if (skipPaging) {
    endPoint += "&skipPaging=true";
  }

  return fetchWrapper(baseUrl + endPoint, {
    credentials: "include",
    headers: {
      ...(username && { Authorization: "Basic " + btoa(`${username}:${password}`) }),
    },
  })
    .then((result) => result.json())
    .then((json) => json);
  // .catch((err) => err);
};

export default get;