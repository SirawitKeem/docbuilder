import Link from "next/link";
import { FileText, Lock, ArrowRight, Layers, FileSignature, Receipt, Building2, Handshake } from "lucide-react";

function getTemplateIcon(templateId) {
  switch (templateId) {
    case "nda":
      return { Icon: FileSignature, colorClass: "bg-[#F5F1FF] text-[#5542F6] border-[#EBE3FF]" };
    case "quotation":
      return { Icon: Receipt, colorClass: "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]" };
    case "distributor":
      return { Icon: Building2, colorClass: "bg-[#FDF2F8] text-[#DB2777] border-[#FCE7F3]" };
    case "partner":
      return { Icon: Handshake, colorClass: "bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]" };
    default:
      return { Icon: FileText, colorClass: "bg-[#F5F1FF] text-[#5542F6] border-[#EBE3FF]" };
  }
}

function getTemplateBadge(template) {
  if (!template.available) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
        <Lock size={10} /> เร็วๆ นี้
      </span>
    );
  }
  if (template.id === "nda") {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F1FF] text-[#5542F6] text-[10px] font-bold border border-[#EBE3FF]">
        ยอดนิยม
      </span>
    );
  }
  if (template.id === "quotation") {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold border border-[#DBEAFE]">
        คำนวณอัตโนมัติ
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
      พร้อมใช้งาน
    </span>
  );
}

export default function TemplateCard({ template, variant = "compact", onSelect }) {
  const { Icon, colorClass } = getTemplateIcon(template.id);

  const cardInner = (
    <div className="bg-white border border-[#EAEAEF] rounded-[20px] shadow-2xs p-5 h-full flex flex-col transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#5542F6]/50 group-hover:shadow-md text-left relative overflow-hidden select-none">
      {/* Top Bar: Icon Box + Category Badge */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorClass} transition-transform group-hover:scale-105 duration-200`}>
          <Icon size={20} />
        </div>
        {getTemplateBadge(template)}
      </div>

      {/* Title & Full Name */}
      <p className="font-bold text-gray-900 text-[15px] group-hover:text-[#5542F6] transition-colors line-clamp-1 font-sans">
        {template.name}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 mb-1 font-normal line-clamp-2 leading-relaxed">
        {template.fullName}
      </p>

      {variant === "full" && (
        <p className="text-xs text-gray-400 mt-2 mb-4 leading-relaxed line-clamp-2">
          {template.description}
        </p>
      )}

      {/* Bottom Action CTA */}
      <div className={variant === "full" ? "mt-auto pt-3 border-t border-gray-100" : "mt-auto pt-3"}>
        {template.available ? (
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

  if (!template.available) {
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

  return (
    <Link href={template.href} className="block group h-full">
      {cardInner}
    </Link>
  );
}
