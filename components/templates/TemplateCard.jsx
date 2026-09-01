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
    <div className="bg-white border border-[#EAEAEF] rounded-[20px] shadow-2xs p-5 h-full flex flex-col transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#5542F6]/50 group-hover:shadow-md text-left relative overflow-hidden select-none">
      {/* Top Bar: Icon Box + Category Badge */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${colorClass.bg} ${colorClass.text} ${colorClass.border} transition-transform group-hover:scale-105 duration-200 shadow-2xs`}>
          <Icon size={20} />
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colorClass.bg} ${colorClass.text} ${colorClass.border}`}>
          {badgeText}
        </span>
      </div>

      {/* Title & Full Name */}
      <p className="font-bold text-gray-900 text-[15px] group-hover:text-[#5542F6] transition-colors line-clamp-1 font-sans">
        {template.name}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 mb-1 font-normal line-clamp-2 leading-relaxed">
        {template.fullName || template.description}
      </p>

      {variant === "full" && (
        <p className="text-xs text-gray-400 mt-2 mb-4 leading-relaxed line-clamp-2">
          {template.description}
        </p>
      )}

      {/* Bottom Action CTA */}
      <div className={variant === "full" ? "mt-auto pt-3 border-t border-gray-100" : "mt-auto pt-3"}>
        {isAvailable ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5542F6]">
            <span>เลือกเทมเพลต</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
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
