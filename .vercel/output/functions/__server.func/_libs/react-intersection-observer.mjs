import { r as reactExports, b as React2 } from "./react.mjs";
var observerMap = /* @__PURE__ */ new Map();
var RootIds = /* @__PURE__ */ new WeakMap();
var rootId = 0;
var unsupportedValue;
function getRootId(root) {
  if (!root) return "0";
  if (RootIds.has(root)) return RootIds.get(root);
  rootId += 1;
  RootIds.set(root, rootId.toString());
  return RootIds.get(root);
}
function optionsToId(options) {
  return Object.keys(options).sort().filter(
    (key) => options[key] !== void 0
  ).map((key) => {
    return `${key}_${key === "root" ? getRootId(options.root) : options[key]}`;
  }).toString();
}
function createObserver(options) {
  const id = optionsToId(options);
  let instance = observerMap.get(id);
  if (!instance) {
    const elements = /* @__PURE__ */ new Map();
    let thresholds;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        var _a;
        const inView = entry.isIntersecting && thresholds.some((threshold) => entry.intersectionRatio >= threshold);
        if (options.trackVisibility && typeof entry.isVisible === "undefined") {
          entry.isVisible = inView;
        }
        [...(_a = elements.get(entry.target)) != null ? _a : []].forEach((callback) => {
          callback(inView, entry);
        });
      });
    }, options);
    thresholds = observer.thresholds || (Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0]);
    instance = {
      id,
      observer,
      elements
    };
    observerMap.set(id, instance);
  }
  return instance;
}
function observe(element, callback, options = {}, fallbackInView = unsupportedValue) {
  if (typeof window.IntersectionObserver === "undefined" && fallbackInView !== void 0) {
    const bounds = element.getBoundingClientRect();
    callback(fallbackInView, {
      isIntersecting: fallbackInView,
      target: element,
      intersectionRatio: typeof options.threshold === "number" ? options.threshold : 0,
      time: 0,
      boundingClientRect: bounds,
      intersectionRect: bounds,
      rootBounds: bounds
    });
    return () => {
    };
  }
  const { id, observer, elements } = createObserver(options);
  const callbacks = elements.get(element) || [];
  if (!elements.has(element)) {
    elements.set(element, callbacks);
  }
  callbacks.push(callback);
  observer.observe(element);
  let unobserved = false;
  return function unobserve() {
    if (unobserved) return;
    unobserved = true;
    callbacks.splice(callbacks.indexOf(callback), 1);
    if (callbacks.length === 0) {
      elements.delete(element);
      observer.unobserve(element);
    }
    if (elements.size === 0) {
      observer.disconnect();
      observerMap.delete(id);
    }
  };
}
var useInsertionEffect = Reflect.get(React2, "useInsertionEffect");
var useSyncEffect = useInsertionEffect != null ? useInsertionEffect : reactExports.useEffect;
function supportsRefCleanup(version2) {
  return (version2 == null ? void 0 : version2.startsWith("19.")) || false;
}
var canUseRefCleanup = supportsRefCleanup(reactExports.version);
function useIntersectionObserverRef(onIntersectionChange, {
  threshold,
  root,
  rootMargin,
  scrollMargin,
  trackVisibility,
  delay,
  fallbackInView,
  skip,
  triggerOnce
}) {
  const onIntersectionChangeRef = reactExports.useRef(onIntersectionChange);
  const observerStateRef = reactExports.useRef({
    node: null,
    stop: void 0,
    owner: null
  });
  if (!useInsertionEffect) {
    onIntersectionChangeRef.current = onIntersectionChange;
  }
  useSyncEffect(() => {
    onIntersectionChangeRef.current = onIntersectionChange;
  }, [onIntersectionChange]);
  return reactExports.useCallback(
    function setRef(element) {
      const observerState = observerStateRef.current;
      if (!element && observerState.owner !== setRef) {
        return;
      }
      if (element === observerState.node) {
        observerState.owner = setRef;
        return canUseRefCleanup ? observerState.stop : void 0;
      }
      const cleanup = observerState.stop;
      observerState.stop = void 0;
      cleanup == null ? void 0 : cleanup();
      if (!element || skip) {
        observerState.node = null;
        observerState.owner = element ? setRef : null;
        return;
      }
      observerState.node = element;
      observerState.owner = setRef;
      let destroyObserver;
      let previousInView;
      function stopObserving() {
        destroyObserver == null ? void 0 : destroyObserver();
        if (observerState.stop === stopObserving) {
          observerState.node = null;
          observerState.stop = void 0;
        }
      }
      observerState.stop = stopObserving;
      destroyObserver = observe(
        element,
        (inView, entry) => {
          onIntersectionChangeRef.current(
            inView,
            entry,
            previousInView
          );
          previousInView = inView;
          if (triggerOnce && inView) stopObserving();
        },
        {
          threshold,
          root,
          rootMargin,
          scrollMargin,
          trackVisibility,
          delay
        },
        fallbackInView
      );
      if (observerState.stop !== stopObserving) destroyObserver();
      return canUseRefCleanup ? observerState.stop : void 0;
    },
    [
      Array.isArray(threshold) ? threshold.toString() : threshold,
      root,
      rootMargin,
      scrollMargin,
      trackVisibility,
      delay,
      fallbackInView,
      skip,
      triggerOnce
    ]
  );
}
var useIsomorphicLayoutEffect = typeof window === "undefined" ? reactExports.useEffect : reactExports.useLayoutEffect;
function useInView({
  threshold,
  delay,
  trackVisibility,
  rootMargin,
  scrollMargin,
  root,
  triggerOnce,
  skip,
  initialInView,
  fallbackInView,
  onChange
} = {}) {
  const lastInViewRef = reactExports.useRef(initialInView);
  const [state, setState] = reactExports.useState({
    inView: !!initialInView,
    entry: void 0
  });
  const observerRef = useIntersectionObserverRef(
    (inView, entry) => {
      const previousInView = lastInViewRef.current;
      lastInViewRef.current = inView;
      if (previousInView === void 0 && !inView) {
        return;
      }
      setState({ inView, entry });
      onChange == null ? void 0 : onChange(inView, entry);
    },
    {
      threshold,
      root,
      rootMargin,
      scrollMargin,
      trackVisibility,
      delay,
      fallbackInView,
      skip,
      triggerOnce
    }
  );
  const refState = reactExports.useRef({
    node: null,
    reset: false
  });
  const setRef = reactExports.useCallback(
    function setRef2(node) {
      if (node) {
        refState.current.node = node;
        refState.current.reset = false;
      } else if (refState.current.node) {
        refState.current.node = null;
        refState.current.reset = true;
      }
      const cleanup = observerRef(node);
      if (!cleanup) return;
      return () => {
        cleanup();
        if (refState.current.node === node) {
          refState.current.node = null;
          refState.current.reset = true;
        }
      };
    },
    [observerRef]
  );
  useIsomorphicLayoutEffect(() => {
    if (!refState.current.reset) return;
    refState.current.reset = false;
    if (triggerOnce || skip) return;
    setState({ inView: !!initialInView, entry: void 0 });
    lastInViewRef.current = initialInView;
  });
  const result = [setRef, state.inView, state.entry];
  result.ref = result[0];
  result.inView = result[1];
  result.entry = result[2];
  return result;
}
export {
  useInView as u
};
