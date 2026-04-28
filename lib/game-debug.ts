/**
 * Game Debug Logger
 * Logs game state transitions to console with structured formatting.
 * Writes a rolling buffer of the last 200 events that can be dumped via:
 *   window.__AGRI_DEBUG_DUMP()
 *
 * Also exposes window.__AGRI_STATE() to snapshot the current store state.
 */

export interface DebugEntry {
    ts: string;
    tag: string;
    msg: string;
    data?: Record<string, unknown>;
}

const MAX_ENTRIES = 200;
const buffer: DebugEntry[] = [];
type GameLogListener = (entry: DebugEntry) => void;
type GameLogListenerKey = GameLogListener | string;

const GLOBAL_LISTENERS_KEY = '__AGRI_GAME_LOG_LISTENERS__';
const globalListeners = globalThis as typeof globalThis & {
    [GLOBAL_LISTENERS_KEY]?: Map<GameLogListenerKey, GameLogListener>;
};
const listeners = globalListeners[GLOBAL_LISTENERS_KEY] ?? new Map<GameLogListenerKey, GameLogListener>();
globalListeners[GLOBAL_LISTENERS_KEY] = listeners;

function timestamp(): string {
    return new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
}

export function gameLog(tag: string, msg: string, data?: Record<string, unknown>) {
    const entry: DebugEntry = { ts: timestamp(), tag, msg, data };
    buffer.push(entry);
    if (buffer.length > MAX_ENTRIES) buffer.shift();

    // Notify store for season activity log (avoids circular dependency)
    if (typeof window !== 'undefined') {
        try {
            window.dispatchEvent(new CustomEvent('agri-game-log', { detail: entry }));
        } catch { /* ignore */ }
    }

    const notifyListeners = () => {
        listeners.forEach((listener) => {
            try {
                listener(entry);
            } catch { /* ignore listener errors */ }
        });
    };
    if (typeof queueMicrotask === 'function') {
        queueMicrotask(notifyListeners);
    } else if (typeof window !== 'undefined') {
        window.setTimeout(notifyListeners, 0);
    } else {
        notifyListeners();
    }

    const consoleEnabled =
        process.env.NEXT_PUBLIC_AGRI_DEBUG === 'true' ||
        (typeof window !== 'undefined' && (window as any).__AGRI_DEBUG_CONSOLE === true);

    if (!consoleEnabled) return;

    // Console output with colour coding
    const colour =
        tag === 'WEATHER' ? 'color:#5dade2' :
        tag === 'CHALLENGE' ? 'color:#82e0aa' :
        tag === 'OPERATION' ? 'color:#f5b041' :
        tag === 'ADVANCE' ? 'color:#bb8fce' :
        tag === 'FIELD' ? 'color:#f0b27a' :
        tag === 'ERROR' ? 'color:#e74c3c;font-weight:bold' :
        'color:#aeb6bf';

    if (data) {
        console.log(`%c[${entry.ts}] [${tag}] ${msg}`, colour, data);
    } else {
        console.log(`%c[${entry.ts}] [${tag}] ${msg}`, colour);
    }
}

export function subscribeGameLog(listener: GameLogListener, key: GameLogListenerKey = listener) {
    listeners.set(key, listener);
    return () => {
        if (listeners.get(key) === listener) listeners.delete(key);
    };
}

/** Dump the entire debug buffer as a formatted string (for copy-paste into bug reports) */
export function dumpLog(): string {
    return buffer.map(e => {
        const dataStr = e.data ? ' | ' + JSON.stringify(e.data) : '';
        return `[${e.ts}] [${e.tag}] ${e.msg}${dataStr}`;
    }).join('\n');
}

/** Install global helpers on window (browser only) */
export function installDebugGlobals() {
    if (typeof window === 'undefined') return;

    (window as any).__AGRI_DEBUG_DUMP = () => {
        const text = dumpLog();
        console.log(text);
        return text;
    };

    (window as any).__AGRI_DEBUG_BUFFER = buffer;
}

// Auto-install on import
installDebugGlobals();
