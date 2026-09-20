type Listener = () => void;

const fired = new Set<string>();
const listeners = new Map<string, Set<Listener>>();

export function signalReady(name: string): void {
  if (fired.has(name)) return;
  fired.add(name);
  const set = listeners.get(name);
  if (set) {
    set.forEach((listener) => listener());
    listeners.delete(name);
  }
}

export function waitForSignal(name: string): Promise<void> {
  if (fired.has(name)) return Promise.resolve();
  return new Promise((resolve) => {
    const set = listeners.get(name) ?? new Set<Listener>();
    set.add(resolve);
    listeners.set(name, set);
  });
}