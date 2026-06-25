import { useCallback, useState } from "@harborclient/plugin-api/react";

/**
 * Example footer panel with local state following the host layout contract.
 */
export function ExampleFooter() {
  const [message, setMessage] = useState(
    "Send a request to see main-process logs."
  );

  /**
   * Refreshes the placeholder message when the user clicks Refresh.
   */
  const handleRefresh = useCallback((): void => {
    setMessage(`Refreshed at ${new Date().toLocaleTimeString()}.`);
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-control">
      <div className="flex shrink-0 items-center justify-between border-b border-separator px-3 py-2 pr-8">
        <h3 className="text-[14px] font-medium text-text">Skeleton Log</h3>
        <button
          type="button"
          className="rounded-md border border-separator bg-control px-3 py-1 text-[14px] text-text hover:bg-selection"
          aria-label="Refresh footer message"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
        <p className="text-[14px] text-muted" role="status">
          {message}
        </p>
      </div>
    </div>
  );
}
