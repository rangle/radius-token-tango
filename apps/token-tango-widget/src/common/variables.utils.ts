export type TokenVariable = {
  name: string;
  value?: VariableValue;
  alias?: string;
  description?: string;
  type: string;
};

export type VariablesMode = {
  name: string;
  variables: TokenVariable[];
};

export type TokenCollection = {
  name: string;
  modes: VariablesMode[];
};

// type guard for VariableValue is alias
function isVariableAlias(value: VariableValue): value is VariableAlias {
  if (typeof value !== "object") return false;
  return (value as VariableAlias).type === "VARIABLE_ALIAS";
}

export const getAllLocalVariableTokens = async () => {
  const variableCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  const collections = [] as TokenCollection[];

  // const rest = await figma.variables.getLocalVariablesAsync();

  //   const variablesToDelete = [
  //     "VariableID:5394:21518",
  //     "VariableID:5393:21487",
  //     "VariableID:5388:21427",
  //     "VariableID:5393:21483",
  //     "VariableID:5393:21484",
  //   ];

  //   variablesToDelete.forEach(async (variableId) => {
  //     const variableToDelete =
  //       await figma.variables.getVariableCollectionByIdAsync(variableId);
  //     variableToDelete?.remove();
  //   });

  //   console.log(
  //     "====>",
  //     rest
  //       .filter(({ name }) => name.indexOf("/") === -1)
  //       .map((v) => [v.name, v.key, v.id, v.scopes])
  //   );

  // iterate through all the collections
  for (let x = 0; x < variableCollections.length; x++) {
    const collection = variableCollections[x];
    if (collection.name === "03-color modes")
      console.log(
        "==> Collection",
        await Promise.all(
          collection.variableIds.map((id) =>
            figma.variables.getVariableByIdAsync(id)
          )
        ).then((variables) =>
          variables.map((v) => [v?.id, v?.name, v?.resolvedType])
        )
      );
    const modes = {} as { [key: string]: VariablesMode };
    for (let j = 0; j < collection.modes.length; j++) {
      modes[collection.modes[j].modeId] = {
        name: collection.modes[j].name,
        variables: [],
      };
    }

    // through all the variables
    for (let i = 0; i < collection.variableIds.length; i++) {
      const variableId = collection.variableIds[i];
      const variable = await figma.variables.getVariableByIdAsync(variableId);

      if (!variable) continue;

      // iterate through all the variables
      for (let j = 0; j < collection.modes.length; j++) {
        const mode = collection.modes[j];
        const value = variable?.valuesByMode[mode.modeId];

        if (value === undefined || value === null) continue;

        // if it's a variable id, we need to find the name of it
        if (isVariableAlias(value)) {
          const alias = await figma.variables.getVariableByIdAsync(value.id);
          if (!alias) continue;
          modes[mode.modeId].variables.push({
            name: variable.name,
            alias: alias.name,
            type: alias.resolvedType,
            description: alias.description,
          });
        } else {
          // not a variable alias
          modes[mode.modeId].variables.push({
            name: variable.name,
            value: value,
            type: variable.resolvedType,
            description: variable.description,
          });
        }
      }
    }

    collections.push({
      name: collection.name,
      modes: Object.values(modes),
    });
  }
  return collections;
};
