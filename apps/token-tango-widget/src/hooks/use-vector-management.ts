import { createLogger } from "@repo/utils";
import { LayerRender, VectorState } from "../types/vector-types";
import { 
  useSyncedState,
  isComponent,
  isComposite,
  isFrame,
  isInstance,
  isVector 
} from "../types/figma-types";
import { isComponentSet } from "../common/figma.types";

const log = createLogger("WIDGET:vectors");

export const useVectorManagement = (): [VectorState, {
  loadVectors: () => Promise<void>;
  clearVectors: () => void;
  toggleVectors: () => void;
}] => {
  const [persistedVectors, setPersistedVectors] = useSyncedState<string | null>(
    "persistedVectors",
    null,
  );
  const [loadedVectors, setLoadedVectors] = useSyncedState<number | null>(
    "loadedVectors",
    null,
  );
  const [withVectors, setWithVectors] = useSyncedState<boolean>(
    "withVectors",
    false,
  );

  const removeSuffix = (name: string) => name.split("#")[0] ?? name;

  const renderLayer = async (
    node: SceneNode,
    parent: string | undefined = undefined,
  ): Promise<LayerRender[]> => {
    const result: LayerRender[] = [];

    if (!isComposite(node)) {
      log("debug", "Not a composite node", node.name, parent, node.type, node);
      return result;
    }

    if (isComponentSet(node)) {
      try {
        log("debug", "Component Set node", node.name, 
          node.defaultVariant, 
          node.variantGroupProperties,
          node.componentPropertyDefinitions,
          node.children,
          parent, node.type, node);

        // Add the component set itself first
        try {
          const componentSetSource = await node.exportAsync({ format: "SVG_STRING" });
          result.push({
            name: node.name,
            description: "",
            source: componentSetSource,
            parent,
            properties: {},
          });
        } catch (error) {
          log("error", "Failed to export component set", error);
        }

        // Process all children
        if (node.children) {
          try {
            const childResults = await Promise.all(
              node.children.map(async (child) => {
                try {
                  // For variant components, we only need to export them, not process their properties
                  if (isComponent(child)) {
                    const source = await child.exportAsync({ format: "SVG_STRING" });
                    return [{
                      name: child.name,
                      description: `${node.name} ${child.name}`,
                      source,
                      parent: node.name,
                      properties: {},
                    }];
                  }
                  return [];
                } catch (error) {
                  log("error", `Failed to process child ${child.name}`, error);
                  return [];
                }
              })
            );
            // Flatten and filter the results
            const flattenedResults = childResults.flat().filter(Boolean);
            result.push(...flattenedResults);
          } catch (error) {
            log("error", "Failed to process children", error);
          }
        }
        return result; // Return early to prevent further processing. Avoids duplication from component sets
      } catch (error) {
        log("error", "Failed to process ComponentSetNode", error);
      }
    } else {
      log("debug", "Not a componentset node", node.name, parent, node.type, node);
    }

    if (isVector(node)) {
      const source = await (node as VectorNode).exportAsync({ format: "SVG_STRING" });
      const description = isVector(node) ? (node as VectorNode).name : "";

      result.push({
        name: (node as VectorNode).name,
        description,
        source,
        parent,
        properties: {},
      });
      log("debug", " check the result", result)

      return result;
    }

    if (isComponent(node) || isInstance(node)) {
      const source = await node.exportAsync({ format: "SVG_STRING" });

      let properties = {};
      let description = "";

      if (isComponent(node)) {
        // Check if it's a variant component (has a parent that's a component set)
        const isVariantComponent = node.parent && isComponentSet(node.parent);

        if (!isVariantComponent) {
          // Only try to get properties for non-variant components
          properties = Object.entries(node.componentPropertyDefinitions).reduce(
            (acc, [name, { defaultValue }]) => {
              return { ...acc, [removeSuffix(name)]: String(defaultValue) };
            },
            {} as Record<string, string>,
          );
          description = node.description;
        }
      } else {
        // For instances, use variant properties
        properties = node.variantProperties ?? {};
      }

      result.push({
        name: node.name,
        description,
        source,
        parent,
        properties,
      });
      log("debug", " check the result", result)

      return result;
    }
    if (isFrame(node) && node.children.every(isVector)) {
      const source = await node.exportAsync({ format: "SVG_STRING" });
      result.push({
        name: node.name,
        description: "",
        source,
        parent,
        properties: {},
      });
      return result;
    }

    if (node.children) {
      await Promise.all(
        node.children.map(async (child) => {
          const childResult = (await renderLayer(child, node.name)).filter(
            (r) => (Array.isArray(r) ? r.length > 0 : r),
          );
          result.push(...childResult);
        }),
      );
    }
    return result;
  };

  const loadVectors = async () => {
    log("debug", ">>> LOADING YOUR ICONS");
    const selected = figma.currentPage.selection;
    if (selected.length === 0) {
      log("debug", "No layers selected");
      return;
    }
    const result = (
      await Promise.all(selected.map((object) => renderLayer(object)))
    )
      .flatMap((r) => r)
      .filter(Boolean);

    log("debug", "RESULT", result);
    setLoadedVectors(result.length);
    setPersistedVectors(JSON.stringify(result));
  };

  const clearVectors = () => {
    log("debug", "Clearing your icons!");
    setPersistedVectors(null);
    setLoadedVectors(null);
  };

  const toggleVectors = () => setWithVectors(!withVectors);

  return [
    { persistedVectors, loadedVectors, withVectors },
    { loadVectors, clearVectors, toggleVectors }
  ];
};