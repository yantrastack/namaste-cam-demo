export type SessionUser = {
  role: string;
  name: string;
};

const SESSION_KEY = "user";
/** Same-tab updates for useSyncExternalStore (storage event is other tabs only). */
const SESSION_CHANGED = "namaste-cam-session-changed";

function emitSessionChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_CHANGED));
}

/** Stable snapshot for useSyncExternalStore — compare raw JSON string, not parsed objects. */
export function getSessionUserJsonSnapshot(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SESSION_KEY) ?? "";
}

export function getServerSessionUserJsonSnapshot(): string {
  return "";
}

export function subscribeSessionUser(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY || e.key === null) onStoreChange();
  };
  const onLocal = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(SESSION_CHANGED, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SESSION_CHANGED, onLocal);
  };
}

export function getSessionUser(): SessionUser | null {
  const raw = getSessionUserJsonSnapshot();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSessionUser(user: SessionUser) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  emitSessionChanged();
}

export function clearSessionUser() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  emitSessionChanged();
}
