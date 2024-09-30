import { primaryAttribute } from "./constants";

export const mapSheetToProgram = (sheet) => {
  var idsIndex = {};
  if (sheet && sheet[0].length) {
    sheet[0].forEach((id, index) => {
      idsIndex[id] = index;
    });
  }
  return idsIndex;
};

export const formatDate = (number, type) => {
  var formattedDate;
  const date = new Date(Math.round((number - 25569) * 86400 * 1000));

  if (type == "YY-MM-DD") {
    formattedDate = `${date.getFullYear()}-${(
      "00" +
      (date.getMonth() + 1)
    ).slice(-2)}-${("00" + date.getDate()).slice(-2)}`;
  }
  return formattedDate;
};

export const createProgramIndex = (program) => {
  const modifiedProgram = {};

  modifiedProgram["program"] = {
    id: program.id,
    name: program.name,
  };
  modifiedProgram["primaryAttr"] = primaryAttribute;
  modifiedProgram["orgUnit"] = {
    index: "",
  };
  modifiedProgram["enrollmentDate"] = {
    index: "",
  };
  modifiedProgram["trackedEntityType"] = program.trackedEntityType.id;

  modifiedProgram["attributes"] = [];
  program.programTrackedEntityAttributes.map((attr) => {

    const options = {};
    if (attr.trackedEntityAttribute.optionSetValue) {
      attr.trackedEntityAttribute.optionSet.options.map(
        (option) => (options[option.name] = option.code)
      );
    }
    modifiedProgram["attributes"].push({
      index: "",
      attribute: attr.trackedEntityAttribute.id,
      name: attr.trackedEntityAttribute.name,
      valueType: attr.valueType,
      optionSetValue: attr.trackedEntityAttribute.optionSetValue,
      options,
      primary: false,
    });
  });

  modifiedProgram["programStages"] = [];
  program.programStages.map((ps, index) => {
    modifiedProgram["programStages"][index] = [];
    modifiedProgram["programStages"][index]["id"] = ps.id;
    modifiedProgram["programStages"][index]["name"] = ps.name;
    modifiedProgram["programStages"][index]["eventDate"] = {
      index: "",
    };
    modifiedProgram["programStages"][index]["dataElements"] = [];
    ps.programStageDataElements.forEach((psde) => {
      const options = {};
      if (psde.dataElement.optionSetValue) {
        psde.dataElement.optionSet.options.map(
          (option) => (options[option.name] = option.code)
        );
      }

      modifiedProgram["programStages"][index]["dataElements"].push({
        index: "",
        dataElement: psde.dataElement.id,
        name: psde.dataElement.name,
        valueType: psde.dataElement.valueType,
        optionSetValue: psde.dataElement.optionSetValue,
        options,
      });
    });
  });

  return modifiedProgram;
};

export const createTei = (orgUnit, program, data) => {
  const attributes = {};
  attributes["orgUnit"] = orgUnit;
  attributes["trackedEntityType"] = program.trackedEntityType;
  attributes["attributes"] = [];

  const primaryAttr = {
    id: program["primaryAttr"],
    value: "",
  };

  program.attributes.forEach((attr) => {
    if (attr.index && (data[attr.index] || data[attr.index]===false)) {
      if (attr.attribute == primaryAttr.id)
        primaryAttr.value = data[attr.index];

      if (attr.valueType == "AGE" || attr.valueType == "DATE") {
        attributes["attributes"].push({
          attribute: attr.attribute,
          value: formatDate(data[attr.index], "YY-MM-DD"),
        });
      } else if (attr.optionSetValue && attr.options[data[attr.index]]) {
        attributes["attributes"].push({
          attribute: attr.attribute,
          value: attr.options[data[attr.index]],
        });
      } else {
        attributes["attributes"].push({
          attribute: attr.attribute,
          value: data[attr.index],
        });
      }
    }
  });

  return {
    primaryAttr,
    attributes,
  };
};

export const createEvents = (teiId, orgUnit, program, data) => {
  const events = [];
  program.programStages.forEach((ps) => {
    if (data[ps.eventDate.index]) {
      const eventDate = formatDate(data[ps.eventDate.index], "YY-MM-DD");
      const event = {
        trackedEntityInstance: teiId,
        programStage: ps.id,
        eventDate: eventDate,
        program: program.program.id,
        orgUnit: orgUnit,
        dataValues: [],
      };
      ps.dataElements.forEach((de) => {
        if (data[de.index] || data[de.index]===false) {
          if (de.valueType == "DATE") {
            event.dataValues.push({
              dataElement: de.dataElement,
              value: formatDate(data[de.index], "YY-MM-DD"),
            });
          } else if (de.optionSetValue && de.options[data[de.index]]) {
            event.dataValues.push({
              dataElement: de.dataElement,
              value: de.options[data[de.index]],
            });
          } else {
            event.dataValues.push({
              dataElement: de.dataElement,
              value: data[de.index],
            });
          }
        }
      });
      events.push(event);
    }
  });
  return events;
};
