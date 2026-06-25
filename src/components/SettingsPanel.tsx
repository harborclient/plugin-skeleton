import {
  useCallback,
  useEffect,
  useState,
} from "@harborclient/sdk/react";
import type { PluginContext } from "@harborclient/sdk";

const STORAGE_KEY = "enabled";

interface Props {
  /**
   * Renderer plugin context from the host.
   */
  hc: PluginContext;
}

/**
 * Example settings panel demonstrating hooks, storage, and hc.pluginId.
 */
export function SettingsPanel({ hc }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Loads the persisted toggle when the panel mounts.
   */
  useEffect(() => {
    let active = true;
    void hc.storage
      .get<boolean>(STORAGE_KEY)
      .then((value: boolean | undefined) => {
        if (active) {
          setEnabled(value ?? false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Failed to load settings.");
        }
      })
      .finally(() => {
        if (active) {
          setBusy(false);
        }
      });
    return () => {
      active = false;
    };
  }, [hc.storage]);

  /**
   * Persists the enabled toggle and shows success feedback.
   */
  const handleToggle = useCallback(async (): Promise<void> => {
    const next = !enabled;
    setEnabled(next);
    setError(null);
    try {
      await hc.storage.set(STORAGE_KEY, next);
      hc.ui.showToast(next ? "Skeleton enabled" : "Skeleton disabled");
    } catch {
      setEnabled(!next);
      setError("Failed to save settings.");
    }
  }, [enabled, hc]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-[14px] text-muted">
        Plugin id: <span className="font-mono text-text">{hc.pluginId}</span>
      </p>
      <label className="flex items-center gap-2 text-[14px] text-text">
        <input
          type="checkbox"
          checked={enabled}
          disabled={busy}
          aria-describedby={
            error != null ? "skeleton-settings-error" : undefined
          }
          aria-invalid={error != null}
          onChange={() => {
            void handleToggle();
          }}
        />
        Enable skeleton logging
      </label>
      {error != null ? (
        <p
          id="skeleton-settings-error"
          className="text-[14px] text-danger"
          role="status"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
