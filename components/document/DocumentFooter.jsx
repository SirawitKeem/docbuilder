export default function DocumentFooter({ title, pageNumber, totalPages }) {
  return (
    <div className="mt-8 pt-2">
      <div className="relative h-6 flex items-center">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #1B7B51 0%, #134F36 92%)",
            clipPath: "polygon(0 0, 92% 0, 88% 100%, 0% 100%)",
          }}
        />
        <div
          className="absolute h-full w-4"
          style={{
            left: "89%",
            background: "#191919",
            clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0% 100%)",
          }}
        />
        <span className="relative z-10 text-white text-[11px] font-semibold pl-4">
          {title}
        </span>
      </div>
      <p className="text-right text-[11px] text-gray-500 mt-1">
        Page {pageNumber} of {totalPages}
      </p>
    </div>
  );
}