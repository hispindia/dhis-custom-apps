export const posOrNeg = function () {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  switch (value) {
    case "true":
      return "Positive";
    case "false":
      return "Negative";
    default:
      '';
  }
};
export const yesOrNo = function () {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  switch (value) {
    case "true":
      return "Yes";
    case "false":
      return "No";
    default:
      '';
  }
};