import Image from "next/image";

export default function DocumentHeader({ logo }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <Image src={logo} alt="Logo" width={130} height={38} className="object-contain" />
        <BrandStripe />
      </div>
    </div>
  );
}

function BrandStripe() {
  return (
    <svg width="380" height="18" viewBox="0 0 380 18" className="shrink-0">
      {/* Two small black parallelograms */}
      <polygon points="0,18 12,18 20,0 8,0" fill="#191919" />
      <polygon points="16,18 28,18 36,0 24,0" fill="#191919" />
      {/* Green solid bar — starts right after, extends to full width */}
      <defs>
        <linearGradient id="stripeGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1B6B47" />
          <stop offset="100%" stopColor="#1B7B51" />
        </linearGradient>
      </defs>
      <polygon points="34,18 380,18 380,0 46,0" fill="url(#stripeGradient)" />
    </svg>
  );
}