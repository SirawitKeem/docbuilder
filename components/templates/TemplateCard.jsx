import Link from "next/link";
import { FileText, Lock, ArrowRight } from "lucide-react";

export default function TemplateCard({ template, variant = "compact" }) {
  const cardInner = (
    <div className="bg-surface border border-border rounded-2xl shadow-xs p-5 h-full flex flex-col transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/50">
      {/* Icon Box */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary mb-3">
        <FileText size={20} />
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
            สร้างเอกสาร <ArrowRight size={13} />
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

  return (
    <Link href={template.href} className="block group">
      {cardInner}
    </Link>
  );
}
