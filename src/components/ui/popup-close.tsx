import { X } from "lucide-react";
import { motion } from "motion/react";

// Single, reusable dismiss control for the loop/event/chat bottom sheets.
// Render this instead of styling Radix's built-in Sheet close button — pass
// showClose={false} to SheetContent alongside it so there's never a duplicate.
//
// Must be rendered as a sibling of the sheet's clipped content wrapper (the
// element carrying rounded-t-* + overflow-hidden/auto), not inside it — it
// floats above the sheet's top edge, and clipping it there would cut it off.
//
// Position/size are inline styles, not Tailwind classes: this project's
// index.css is a static, pre-generated Tailwind snapshot with no live build
// step, so any class not already present in that file (e.g. "-top-6",
// "pr-20") silently has no effect. Inline styles always work regardless.
export function PopupClose({ onClose }: { onClose: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClose}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Close"
      className="z-20 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer"
      style={{ position: "absolute", top: "-60px", right: "16px", width: "48px", height: "48px" }}
    >
      <X className="w-5 h-5 text-[#6A6A88]" aria-hidden="true" />
    </motion.button>
  );
}
