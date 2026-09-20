// src/components/ui/SourceGuard.tsx
'use client';

import { useEffect } from 'react';

/**
 * Deterrent against casual copying: blocks the context menu, the view-source
 * and save-page shortcuts, and the devtools shortcuts.
 *
 * This is NOT a security control. Anything the browser renders is already on
 * the visitor's machine, and the bundle stays readable through the Network
 * panel, `curl`, or a browser launched with devtools already open. It only
 * raises the effort for a casual right-click-and-save. Never put a secret in
 * client code and rely on this.
 */
const BLOCKED_WITH_CTRL = new Set(['u', 's']); // view-source, save page
const BLOCKED_WITH_CTRL_SHIFT = new Set(['i', 'j', 'c']); // devtools panels

export default function SourceGuard() {
  useEffect(() => {
    // Let the context menu through inside form fields so paste still works,
    // and leave it alone for anyone using assistive tech shortcuts on text.
    const isEditable = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el || !el.tagName) return false;
      const tag = el.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || el.isContentEditable;
    };

    const onContextMenu = (e: MouseEvent) => {
      if (!isEditable(e.target)) e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'f12') {
        e.preventDefault();
        return;
      }
      if (e.ctrlKey && e.shiftKey && BLOCKED_WITH_CTRL_SHIFT.has(key)) {
        e.preventDefault();
        return;
      }
      // Cmd+Opt+I/J/C on macOS
      if (e.metaKey && e.altKey && BLOCKED_WITH_CTRL_SHIFT.has(key)) {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && BLOCKED_WITH_CTRL.has(key)) {
        // Ctrl+S inside a field is harmless and some users reflex-press it.
        if (!isEditable(e.target)) e.preventDefault();
      }
    };

    // Dragging an image out of the page is the other one-click copy path.
    const onDragStart = (e: DragEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'IMG' || el.tagName === 'VIDEO')) e.preventDefault();
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('dragstart', onDragStart);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('dragstart', onDragStart);
    };
  }, []);

  return null;
}
