import { type ReactNode, useEffect } from 'react';

export type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange, open]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/75">
      <div
        className="bg-gray-100 white rounded-xl shadow-xl w-full max-w-lg"
        tabIndex={-1}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={onOpenChange}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
