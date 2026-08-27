import Link from "next/link";
import { FileText, Lock, ArrowRight, Layers } from "lucide-react";

export default function TemplateCard({ template, variant = "compact", onSelect }) {
  const cardInner = (
    <div className="bg-surface border border-border rounded-2xl shadow-xs p-5 h-full flex flex-col transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/50 text-left">
      {/* Top: Icon Box */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
          <FileText size={20} />
        </div>
      </div>

      <p className="font-bold text-foreground text-[15px] group-hover:text-primary transition-colors">
        {template.name}
      </p>
      <p className="text-xs text-muted-foreground mb-1 font-medium">{template.fullName}</p>

      {variant === "full" && (
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{template.description}</p>
      )}

      <div className={variant === "full" ? "mt-auto pt-3" : "mt-auto pt-2"}>
        {template.available ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
            เลือกเทมเพลต <ArrowRight size={13} />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Lock size={12} />
            เร็วๆ นี้
          </span>
        )}
      </div>
    </div>
  );

  if (!template.available) {
    return <div className="opacity-60 cursor-not-allowed">{cardInner}</div>;
  }

  if (onSelect) {
    return (
      <div
        onClick={() => onSelect(template)}
        className="block group cursor-pointer h-full"
      >
        {cardInner}
      </div>
    );
  }

  return (
    <Link href={template.href} className="block group h-full">
      {cardInner}
    </Link>
  );
}
