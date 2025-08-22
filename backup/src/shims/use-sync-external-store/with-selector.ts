import { useRef, useSyncExternalStore } from "react";

// Re-export the base hook for compatibility
export { useSyncExternalStore } from "react";

function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: undefined | (() => Snapshot),
  selector: (snapshot: Snapshot) => Selection,
  isEqual: (a: Selection, b: Selection) => boolean = Object.is
): Selection {
  const lastSelectionRef = useRef<Selection>();
  const lastSnapshotRef = useRef<Snapshot>();

  const getSelectedSnapshot = () => {
    const nextSnapshot = getSnapshot();

    // Only recompute when the underlying snapshot reference changes
    if (lastSnapshotRef.current !== nextSnapshot) {
      const nextSelection = selector(nextSnapshot);
      const prevSelection = lastSelectionRef.current;

      if (prevSelection === undefined || !isEqual(prevSelection, nextSelection)) {
        lastSelectionRef.current = nextSelection;
      }
      lastSnapshotRef.current = nextSnapshot;
    }

    // Return the previous selection reference when "equal" to avoid rerenders
    return lastSelectionRef.current as Selection;
  };

  const getSelectedServerSnapshot =
    getServerSnapshot && (() => selector(getServerSnapshot()));

  return useSyncExternalStore(
    subscribe,
    getSelectedSnapshot,
    getSelectedServerSnapshot as any
  );
}

export { useSyncExternalStoreWithSelector as default, useSyncExternalStoreWithSelector };