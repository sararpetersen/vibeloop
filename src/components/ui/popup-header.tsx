import type { ReactNode } from "react";

// Single header layout for the loop/event/chat bottom sheets — icon/leading
// element, title, optional subtitle, all on the same blurred sticky band.
// Pass `leading` for whatever identity element the popup needs (a mood icon
// box, a colored dot) rather than forking the whole header per popup.
//
// flexShrink/minHeight are inline: this project's index.css is a static,
// pre-generated Tailwind snapshot with no live build step, so classes like
// "flex-shrink-0" that aren't already in that file silently do nothing.
// No right padding is reserved for PopupClose — it floats above the sheet's
// top edge now, so it no longer overlaps this row.
export function PopupHeader({ leading, title, subtitle }: { leading?: ReactNode; title: string; subtitle?: string }) {
  return (
    <div
      className="sticky top-0 z-10 px-6 pt-6 pb-4 border-b border-[#E0E8F5]"
      style={{
        flexShrink: 0,
        background: "linear-gradient(to bottom, #F6F8FBEE, #FAFBFDEE)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-3">
        {leading}
        <div className="flex-1 min-w-0">
          <h2 className="text-[#4A4A6A] truncate font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-[#8A8AA8] mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
