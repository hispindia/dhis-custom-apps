export function destrictureHomeList(record) {
  // let keyAttr = {}

  const data = record.map((item, j) => {
    let decObj = {
      id: item.trackedEntity
    };
    item.attributes.forEach((attr, i) => {
      // if (j == 0) keyAttr[attr.displayName] = attr.attribute
      decObj[attr.displayName] = attr.value;
    });
    return decObj;
  });
  return data;
}
export const arrayWithNum = n => Array.from({
  length: 3 + 1
}, (_, i) => i);
export const getPageNumbers = function () {
  let totalPages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  let currentPage = arguments.length > 1 ? arguments[1] : undefined;
  const pages = [];

  // Always show first 3 pages
  for (let i = 1; i <= Math.min(3, totalPages); i++) {
    pages.push(i);
  }

  // Add first ellipsis if needed
  if (currentPage > 5) {
    pages.push("...");
  }

  // Middle current page range
  const start = Math.max(4, currentPage - 1);
  const end = Math.min(totalPages - 3, currentPage + 1);
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) pages.push(i);
  }

  // Add second ellipsis if needed
  if (currentPage < totalPages - 4) {
    pages.push("...");
  }

  // Always show last 3 pages
  for (let i = Math.max(totalPages - 2, 1); i <= totalPages; i++) {
    if (!pages.includes(i)) pages.push(i);
  }
  return pages;
};