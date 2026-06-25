import { installReact } from "@harborclient/plugin-api";
import type { PluginContext } from "@harborclient/plugin-api";
import { ExampleFooter } from "./components/ExampleFooter";
import { SettingsPanel } from "./components/SettingsPanel";

/**
 * Activates the renderer half and registers example UI contributions.
 *
 * @param hc - Renderer plugin context from the HarborClient host.
 */
export function activate(hc: PluginContext): void {
  installReact(hc.react);

  /**
   * Settings panel host that closes over the plugin context.
   */
  function SettingsPanelHost() {
    return <SettingsPanel hc={hc} />;
  }

  hc.subscriptions.push(
    hc.ui.registerSettingsSection({
      id: "settings",
      title: "Skeleton",
      Component: SettingsPanelHost,
    })
  );

  hc.subscriptions.push(
    hc.ui.registerFooterPanel({
      id: "footer",
      title: "Skeleton Log",
      Component: ExampleFooter,
    })
  );
}
