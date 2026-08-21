import Link from "next/link";
import { FileText, Lock, ArrowRight } from "lucide-react";

const colorMap = {
  gray: "bg-[#F3F3F5] text-[#646469] border border-[#E4E4E8]",
  emerald: "bg-[#DDEEE2] text-[#17682F]",
  primary: "bg-[#F5F1FF] text-[#7C4DFF]",
  success: "bg-[#DDEEE2] text-[#17682F]",
  purple: "bg-[#F5F1FF] text-[#7C4DFF]",
  warning: "bg-[#FFF2CE] text-[#725000]",
};

export default function TemplateCard({ template, variant = "compact" }) {
  const iconClasses = colorMap[template.color] || colorMap.gray;

  const cardInner = (
    <div className="bg-white border border-[#E4E4E8] rounded-[16px] shadow-card p-5 h-full flex flex-col">
      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-3 ${iconClasses}`}>
        <FileText size={20} />
      </div>
      <p className="font-semibold text-[#22162B] text-[15px]">{template.name}</p>
      <p className="text-xs text-[#646469] mb-1">{template.fullName}</p>
      {variant === "full" && (
        <p className="text-xs text-[#646469] mb-4">{template.description}</p>
      )}
      <div className={variant === "full" ? "mt-auto pt-3" : "mt-auto pt-2"}>
        {template.available ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-[#7C4DFF]">
            สร้างเอกสาร <ArrowRight size={14} />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#B2AFBC]">
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
    <Link href={template.href} className="block hover:-translate-y-0.5 transition-transform">
      {cardInner}
    </Link>
  );
}
