import type {ReactNode} from "react";

export type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-blue-950 white rounded-xl shadow-xl w-full max-w-lg">
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