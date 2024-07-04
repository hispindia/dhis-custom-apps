
export const formatDate = (period) => {
  period = period.split('-');
  if(period.length == 1) {
    let year = period[0]
    return {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`
    }
  } else {
    let year = period[0];
    let month = period[1];
    let date = period[2] ? period[2]: new Date(period[0], period[1], 0).getDate();
    return {
      startDate: `${year}-${month}-01`,
      endDate: `${year}-${month}-${date}`,
    }
  }
};
