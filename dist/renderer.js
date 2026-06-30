// ../harborclient-sdk/dist/runtime/reactHost.js
var HOST_REACT_GLOBAL_KEY = "__HARBORCLIENT_HOST_REACT__";
var hostReact = null;
function readGlobalHostReact() {
  if (typeof globalThis === "undefined") {
    return null;
  }
  const candidate = globalThis[HOST_REACT_GLOBAL_KEY];
  return candidate ?? null;
}
function setHostReact(react) {
  hostReact = react;
  if (typeof globalThis !== "undefined") {
    globalThis[HOST_REACT_GLOBAL_KEY] = react;
  }
}
function requireHostReact() {
  if (hostReact == null) {
    const globalReact = readGlobalHostReact();
    if (globalReact != null) {
      hostReact = globalReact;
    }
  }
  if (hostReact == null) {
    throw new Error(
      "Plugin React host is not installed. Call installReact(hc.react) at the start of activate()."
    );
  }
  return hostReact;
}

// ../harborclient-sdk/dist/runtime/index.js
function installReact(react) {
  setHostReact(react);
}

// ../harborclient-sdk/dist/runtime/react.js
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
function useMemo(factory, deps) {
  return hook("useMemo")(factory, deps);
}
function useRef(initialValue) {
  return hook("useRef")(initialValue);
}
function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  return hook("useSyncExternalStore")(subscribe, getSnapshot, getServerSnapshot);
}
function forwardRef(render) {
  let forwarded = null;
  function LazyForwardRef(props, ref) {
    const react = requireHostReact();
    if (forwarded === null) {
      forwarded = react.forwardRef(render);
    }
    return react.createElement(forwarded, { ...props, ref });
  }
  const displayName = render.displayName ?? render.name ?? "Component";
  LazyForwardRef.displayName = `ForwardRef(${displayName})`;
  return LazyForwardRef;
}
function useImperativeHandle(ref, create, deps) {
  return hook("useImperativeHandle")(ref, create, deps);
}
function cloneElement(element, props, ...children) {
  return hook("cloneElement")(element, props, ...children);
}
function isValidElement(element) {
  return hook("isValidElement")(element);
}
function createContext(defaultValue) {
  return hook("createContext")(defaultValue);
}
function useContext(context) {
  return hook("useContext")(context);
}
function useId() {
  return hook("useId")();
}
function useLayoutEffect(effect, deps) {
  return hook("useLayoutEffect")(effect, deps);
}
function createElement(type, props, ...children) {
  return hook("createElement")(type, props, ...children);
}
var reactNamespace = {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useSyncExternalStore,
  forwardRef,
  useImperativeHandle,
  cloneElement,
  isValidElement,
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  createElement
};
var defaultExport = new Proxy(reactNamespace, {
  get(target, prop, receiver) {
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    return requireHostReact()[prop];
  }
});

// ../harborclient-sdk/dist/runtime/jsx-runtime.js
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
