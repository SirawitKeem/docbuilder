import Link from "next/link";
import { FileText, Lock, ArrowRight } from "lucide-react";

const colorMap = {
  primary: "bg-primary-100 text-primary-600",
  success: "bg-success-100 text-success-600",
  purple: "bg-purple-100 text-purple-600",
  warning: "bg-warning-100 text-warning-600",
};

export default function TemplateCard({ template, variant = "compact" }) {
  const iconClasses = colorMap[template.color] || colorMap.primary;

  const cardInner = (
    <div className="bg-white border border-gray-200 rounded-card shadow-card p-5 h-full flex flex-col">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconClasses}`}>
        <FileText size={20} />
      </div>
      <p className="font-semibold text-gray-900 text-[15px]">{template.name}</p>
      <p className="text-xs text-gray-500 mb-1">{template.fullName}</p>
      {variant === "full" && (
        <p className="text-xs text-gray-500 mb-4">{template.description}</p>
      )}
      <div className={variant === "full" ? "mt-auto pt-3" : "mt-auto pt-2"}>
        {template.available ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600">
            สร้างเอกสาร <ArrowRight size={14} />
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
    return <div className="opacity-60 cursor-not-allowed">{cardInner}</div>;
  }

  return (
    <Link href={template.href} className="block hover:-translate-y-0.5 transition-transform">
      {cardInner}
    </Link>
  );
}
