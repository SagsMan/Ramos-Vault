import { MARQUEE_MESSAGES } from "../../data/mockData";

export default function MarqueeBanner() {
  const msgs = [...MARQUEE_MESSAGES, ...MARQUEE_MESSAGES];
  return (
    <div className="overflow-hidden bg-primary/10 border-y border-primary/20 py-2">
      <div className="flex animate-marquee whitespace-nowrap gap-12">
        {msgs.map((msg, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs font-medium text-primary/80">
            <span className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
