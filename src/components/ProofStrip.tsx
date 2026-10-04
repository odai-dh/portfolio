import { FadeIn } from './FadeIn';

// Proof points, all sourced from the Aeoflo and Vidare project write-ups in portfolio.md
const STATS = [
  { value: '6', label: 'brand dashboards in one platform', detail: 'built for prospects like Oatly and Stiga' },
  { value: '20,000+', label: 'lines in the Aeoflo website', detail: 'built solo, from scratch' },
  { value: '1 night', label: 'to the first Vidare prototype', detail: 'at a hackathon, then 5 days to finish it' },
];

export function ProofStrip() {
  return (
    <FadeIn>
      <div className="mb-8 mt-16 rounded-lg xl:mt-28 border border-border/60 bg-card/40 p-6 md:p-8">
        <dl className="grid gap-6 sm:grid-cols-3">
          {STATS.map(stat => (
            <div key={stat.label}>
              <dt className="font-headline text-3xl font-bold text-primary">{stat.value}</dt>
              <dd className="mt-1 text-sm text-foreground">{stat.label}</dd>
              <dd className="text-xs text-muted-foreground">{stat.detail}</dd>
            </div>
          ))}
        </dl>
        <figure className="mt-8 border-t border-border/60 pt-6">
          <blockquote className="text-base italic text-muted-foreground md:text-lg">
            “He grew from a talented intern into a dependable developer capable of shipping production-ready features independently.”
          </blockquote>
          <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
            Antoine Abribat, Co-Founder &amp; COO, Aeoflo
          </figcaption>
        </figure>
      </div>
    </FadeIn>
  );
}
