// Define possible routes in the widget
export type RouteName = "empty" | "loaded";

type RouteState = {
  currentRoute: RouteName;
  params: Record<string, unknown>;
};

/**
 * Singleton store for routing state that minimizes widget re-renders
 */
const routingStore = {
  state: {
    currentRoute: "empty" as RouteName,
    params: {} as Record<string, unknown>,
  },
  listeners: new Set<() => void>(),

  getState: () => routingStore.state,

  setState: (newState: Partial<RouteState>) => {
    routingStore.state = { ...routingStore.state, ...newState };
    routingStore.listeners.forEach((listener) => listener());
  },

  subscribe: (listener: () => void) => {
    routingStore.listeners.add(listener);
    return () => routingStore.listeners.delete(listener);
  },
};

/**
 * Hook to access routing state with minimal widget re-renders
 */
export const useRouting = () => {
  const { widget } = figma;
  const { useSyncedState, useEffect } = widget;
  const [, forceUpdate] = useSyncedState<number>("routeUpdate", 0);

  // Subscribe to store updates only in the main widget component
  useEffect(() => {
    const unsubscribe = routingStore.subscribe(() => {
      Promise.resolve().then(() => forceUpdate((prev) => prev + 1));
    });
    return unsubscribe;
  });

  return {
    ...routingStore.getState(),
    navigate: (route: RouteName) => routingStore.setState({ currentRoute: route }),
    setParams: (params: Record<string, unknown>) => routingStore.setState({ params }),
  };
}; 