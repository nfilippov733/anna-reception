import { CUSTOMER_LOGOS } from "@/content/customerLogos";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function SocialProofLogos() {
  const doubled = [...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS];
  return (
    <section aria-label="Customers" className="py-8 border-y border-border bg-bg-alt overflow-hidden">
      <div className="flex gap-12 animate-marquee motion-reduce:animate-none whitespace-nowrap">
        {doubled.map((logo, i) => (
          <div key={i} className="flex items-center justify-center min-w-[120px] h-12 opacity-70">
            {logo.src ? (
              <Image src={logo.src} alt={logo.name} width={120} height={40} />
            ) : (
              <MissingAsset label={`logo: ${logo.name}`} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
