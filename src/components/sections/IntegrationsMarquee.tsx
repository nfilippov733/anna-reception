import { INTEGRATION_LOGOS } from "@/content/integrations";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function IntegrationsMarquee() {
  const doubled = [...INTEGRATION_LOGOS, ...INTEGRATION_LOGOS];
  return (
    <section className="py-16 border-y border-sage/30 bg-cream-deep overflow-hidden" aria-label="Integrations">
      <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-mono-label mb-8">
        200+ Integrations · Always Growing
      </p>
      <div className="flex gap-16 animate-marquee motion-reduce:animate-none whitespace-nowrap">
        {doubled.map((logo, i) => (
          <div key={i} className="flex items-center justify-center min-w-[140px] h-10 opacity-70">
            {logo.src ? (
              <Image src={logo.src} alt={logo.name} width={140} height={32} />
            ) : (
              <MissingAsset label={`logo: ${logo.name}`} width={140} height={32} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
