import { CUSTOMER_LOGOS } from "@/content/customerLogos";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import Image from "next/image";

export function SocialProofLogos() {
  const doubled = [...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS];
  return (
    <section aria-label="Customers" className="py-12 border-y border-sage/30 bg-cream-deep overflow-hidden">
      <div className="mx-auto max-w-page px-4">
        <Eyebrow className="text-center">Trusted by UK SMBs</Eyebrow>
      </div>
      <div className="mt-6 flex gap-12 animate-marquee motion-reduce:animate-none whitespace-nowrap" style={{ animationDuration: "45s" }}>
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
