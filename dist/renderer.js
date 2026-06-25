// node_modules/.pnpm/@harborclient+sdk@0.4.3_react@19.2.7/node_modules/@harborclient/sdk/dist/runtime/reactHost.js
var hostReact = null;
function setHostReact(react) {
  hostReact = react;
}
function requireHostReact() {
  if (hostReact == null) {
    throw new Error(
      "Plugin React host is not installed. Call installReact(hc.react) at the start of activate()."
    );
  }
  return hostReact;
}

// node_modules/.pnpm/@harborclient+sdk@0.4.3_react@19.2.7/node_modules/@harborclient/sdk/dist/runtime/index.js
function installReact(react) {
  setHostReact(react);
}

// node_modules/.pnpm/@harborclient+sdk@0.4.3_react@19.2.7/node_modules/@harborclient/sdk/dist/runtime/react.js
function hook(name) {
  const react = requireHostReact();
  const fn = react[name];
  if (typeof fn !== "function") {
    throw new Error(`React hook "${String(name)}" is not available on hc.react.`);
  }
  return fn;
}
function useState(initialState) {
  return hook("useState")(initialState);
}
function useEffect(effect, deps) {
  return hook("useEffect")(effect, deps);
}
function useCallback(callback, deps) {
  return hook("useCallback")(callback, deps);
}

// node_modules/.pnpm/@harborclient+sdk@0.4.3_react@19.2.7/node_modules/@harborclient/sdk/dist/runtime/jsx-runtime.js
var Fragment = Symbol.for("@harborclient/sdk.Fragment");
function build(type, props, key) {
  const react = requireHostReact();
  const elementType = type === Fragment ? react.Fragment : type;
  const { children, ...rest } = props ?? {};
  if (key !== void 0) {
    rest.key = key;
  }
  return react.createElement(elementType, rest, children);
}
var jsx = build;
var jsxs = build;

// src/components/ExampleFooter.tsx
function ExampleFooter() {
  const [message, setMessage] = useState(
    "Send a request to see main-process logs."
  );
  const handleRefresh = useCallback(() => {
    setMessage(`Refreshed at ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}.`);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 flex-col bg-control", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center justify-between border-b border-separator px-3 py-2 pr-8", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-[14px] font-medium text-text", children: "Skeleton Log" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "rounded-md border border-separator bg-control px-3 py-1 text-[14px] text-text hover:bg-selection",
          "aria-label": "Refresh footer message",
          onClick: handleRefresh,
          children: "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1 overflow-auto px-3 py-3", children: /* @__PURE__ */ jsx("p", { className: "text-[14px] text-muted", role: "status", children: message }) })
  ] });
}

// src/components/SettingsPanel.tsx
var STORAGE_KEY = "enabled";
function SettingsPanel({ hc }) {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let active = true;
    void hc.storage.get(STORAGE_KEY).then((value) => {
      if (active) {
        setEnabled(value ?? false);
      }
    }).catch(() => {
      if (active) {
        setError("Failed to load settings.");
      }
    }).finally(() => {
      if (active) {
        setBusy(false);
      }
    });
    return () => {
      active = false;
    };
  }, [hc.storage]);
  const handleToggle = useCallback(async () => {
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
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-[14px] text-muted", children: [
      "Plugin id: ",
      /* @__PURE__ */ jsx("span", { className: "font-mono text-text", children: hc.pluginId })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[14px] text-text", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: enabled,
          disabled: busy,
          "aria-describedby": error != null ? "skeleton-settings-error" : void 0,
          "aria-invalid": error != null,
          onChange: () => {
            void handleToggle();
          }
        }
      ),
      "Enable skeleton logging"
    ] }),
    error != null ? /* @__PURE__ */ jsx(
      "p",
      {
        id: "skeleton-settings-error",
        className: "text-[14px] text-danger",
        role: "status",
        children: error
      }
    ) : null
  ] });
}

// src/renderer.tsx
function activate(hc) {
  installReact(hc.react);
  function SettingsPanelHost() {
    return /* @__PURE__ */ jsx(SettingsPanel, { hc });
  }
  hc.subscriptions.push(
    hc.ui.registerSettingsSection({
      id: "settings",
      title: "Skeleton",
      Component: SettingsPanelHost
    })
  );
  hc.subscriptions.push(
    hc.ui.registerFooterPanel({
      id: "footer",
      title: "Skeleton Log",
      Component: ExampleFooter
    })
  );
}
export {
  activate
};
