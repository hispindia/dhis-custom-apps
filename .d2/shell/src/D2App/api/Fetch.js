function fetchWrapper() {
  for (var _len = arguments.length, input = new Array(_len), _key = 0; _key < _len; _key++) {
    input[_key] = arguments[_key];
  }
  return new Promise((resolve, reject) => {
    fetch(...input).then(response => {
      if (!response.ok) {
        if (response) {
          throw new Error("Unauthorized");
        }
        throw response;
      }
      resolve(response);
    }).catch(error => {
      console.log({
        error
      });
      if (error.message) {
        alert("Session expired. Please login again.");
        window.location.href = "../../../dhis-web-commons-security/logout.action";
      }
      reject(error);
    });
  });
}
function pull(baseUrl, username, password, endPoint, pagingObject, params) {
  const {
    paging,
    pageSize,
    totalPages,
    page,
    filter,
    order,
    skipPaging = false
  } = pagingObject ? pagingObject : {};
  endPoint += "?";
  if (filter) endPoint += `${filter}&`;
  if (order) endPoint += `${order}&`;
  if (paging) {
    endPoint += `paging=true&pageSize${pageSize}&page=${page}&`;
    if (totalPages) endPoint += `totalPages=${totalPages}&`;
  } else endPoint += `paging=false&`;
  if (params) endPoint += params.join("&");
  if (skipPaging) endPoint += "&skipPaging=true";
  return fetchWrapper(baseUrl + endPoint, {
    credentials: "include",
    headers: {
      Authorization: !username ? "" : "Basic " + btoa(`${username}:${password}`)
    }
  }).then(result => result.json()).then(json => json);
}
function push(baseUrl, username, password, endPoint, payload, method) {
  return fetchWrapper(baseUrl + endPoint, {
    method: method || "POST",
    credentials: "include",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: !username ? "" : "Basic " + btoa(`${username}:${password}`)
    }
  }).then(response => {
    if (result.headers.get("content-type").includes("application/json")) {
      return result.json().then(res => {
        return res;
      });
    } else {
      alert("Session expired. Please login again.");
      window.location.href = "../../../dhis-web-commons-security/logout.action";
      throw new Error("Invalid content type, expected application/json");
    }
  });
}
export { pull, push };