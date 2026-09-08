import Link from "next/link";
import { FileText, Lock, ArrowRight } from "lucide-react";
import { EXTENDED_ICON_MAP } from "@/components/templates/CreateCategoryModal";
import { COLOR_MAP } from "@/components/templates/CategoryManagerModal";

export default function TemplateCard({ template, variant = "compact", onSelect }) {
  const iconData = EXTENDED_ICON_MAP[template.icon];
  const Icon = iconData ? iconData.icon : FileText;
  const colorClass = COLOR_MAP[template.color] || COLOR_MAP.purple;
  const badgeText = template.badge || "พร้อมใช้งาน";

  const isAvailable = template.available !== false;

  const cardInner = (
    <div className="bg-surface border border-border rounded-[12px] shadow-2xs p-5 h-full flex flex-col transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-card text-left relative overflow-hidden select-none">
      {/* Top Bar: Icon Box + Category Badge */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className={`w-9 h-9 rounded-[6px] flex items-center justify-center border ${colorClass.bg} ${colorClass.text} ${colorClass.border} transition-transform group-hover:scale-105 duration-200 shadow-2xs`}>
          <Icon size={18} />
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colorClass.bg} ${colorClass.text} ${colorClass.border}`}>
          {badgeText}
        </span>
      </div>

      {/* Title & Full Name */}
      <p className="font-semibold text-foreground text-[15px] group-hover:text-primary transition-colors line-clamp-1 font-sans">
        {template.name}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5 mb-1 font-normal line-clamp-2 leading-relaxed">
        {template.fullName || template.description}
      </p>

      {variant === "full" && (
        <p className="text-xs text-muted-foreground/80 mt-2 mb-4 leading-relaxed line-clamp-2">
          {template.description}
        </p>
      )}

      {/* Bottom Action CTA */}
      <div className={variant === "full" ? "mt-auto pt-3 border-t border-border" : "mt-auto pt-3"}>
        {isAvailable ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:text-primary/90">
            <span>สร้างเอกสาร</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
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

  if (!isAvailable) {
    return <div className="opacity-60 cursor-not-allowed h-full">{cardInner}</div>;
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

  const standardHref = ["quotation", "nda", "partner", "distributor"].includes((template.id || "").toLowerCase())
    ? `/create/${template.id}`
    : `/create/custom?categoryId=${template.id}`;

  return (
    <Link href={template.href || standardHref} className="block group h-full">
      {cardInner}
    </Link>
  );
}
