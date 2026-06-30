import type {
  MainPluginContext,
  PluginHttpRequest,
  PluginHttpResponse,
} from "@harborclient/sdk/main";
import { createLogger } from "@harborclient/sdk/runtime-utils";

const logger = createLogger("skeleton");

/**
 * Activates the main-process half: logs completed HTTP exchanges to the terminal.
 *
 * @param hc - Main plugin context from the HarborClient host.
 */
export function activate(hc: MainPluginContext): void {
  hc.subscriptions.push(
    hc.http.onAfterSend(
      (request: PluginHttpRequest, response: PluginHttpResponse) => {
        logger.info(`${response.status} ${request.method} ${request.url}`);
      }
    )
  );
}
