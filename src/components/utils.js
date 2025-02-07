// utils/indicatorUtils.js

// Extracts the name of a data element by ID from the list
export const getDataElementNameById = (id, allDataElements) => {
    const dataElement = allDataElements.find((element) => element.id === id);
    return dataElement ? dataElement.name : id; // Return the name if found, else return the original ID
  };
  
  // Extracts and maps numerator IDs to names
  export const mapNumeratorIdsToNames = (numerator, allDataElements) => {
    if (!numerator || !allDataElements.length) return "No numerator data available";
  
    // Regex to extract IDs wrapped in #{}
    const numeratorIds = numerator.match(/#\{([^\}]+)\}/g) || [];
  
    // Map each ID to its name
    return numeratorIds
      .map((id) => {
        const idValue = id.replace("#{", "").replace("}", "");
        const name = getDataElementNameById(idValue, allDataElements);
        return `#{${name}}`;
      })
      .join(" + ");
  };
  