import { INTEGRATION_LOGOS } from "@/content/integrations";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function IntegrationsMarquee() {
  const doubled = [...INTEGRATION_LOGOS, ...INTEGRATION_LOGOS];
  return (
    <section className="py-12 border-y border-border bg-bg-alt overflow-hidden" aria-label="Integrations">
      <p className="text-center text-sm text-fg-muted mb-6">Works with the tools you already use</p>
      <div className="flex gap-12 animate-marquee motion-reduce:animate-none whitespace-nowrap">
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
