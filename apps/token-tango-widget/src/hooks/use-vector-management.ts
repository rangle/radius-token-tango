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
      log("debug", "Not a composite node", node.name, parent, node.type);
      return result;
    }
    if (isComponent(node) || isInstance(node)) {
      const source = await node.exportAsync({ format: "SVG_STRING" });

      const properties = isComponent(node)
        ? Object.entries(node.componentPropertyDefinitions).reduce(
            (acc, [name, { defaultValue }]) => {
              return { ...acc, [removeSuffix(name)]: String(defaultValue) };
            },
            {} as Record<string, string>,
          )
        : node.variantProperties ?? {};

      const description = isComponent(node) ? node.description : "";

      result.push({
        name: node.name,
        description,
        source,
        parent,
        properties,
      });
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