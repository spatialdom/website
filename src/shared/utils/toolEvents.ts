export type ToolEventName = 'opened' | 'completed' | 'copied' | 'product_clicked';

// This only emits an in-page event. No analytics service or storage is attached.
export function emitToolEvent(tool: string, action: ToolEventName) {
  window.dispatchEvent(new CustomEvent('spatialdom:tool', { detail: { tool, action } }));
}
