import type { Proof, Recommendation } from '@/lib/markdown';
import { FadeIn } from './FadeIn';

// The numbers and the quote come from portfolio.md (`proof` and `recommendation`)
export function ProofStrip({ proof, recommendation }: { proof: Proof[]; recommendation: Recommendation }) {
  return (
    <FadeIn>
      <div className="mb-8 mt-16 rounded-lg xl:mt-28 border border-border/60 bg-card/40 p-6 md:p-8">
        <dl className="grid gap-6 sm:grid-cols-3">
          {proof.map(stat => (
            <div key={stat.label}>
              <dt className="font-headline text-3xl font-bold text-primary">{stat.value}</dt>
              <dd className="mt-1 text-sm text-foreground">{stat.label}</dd>
              <dd className="text-xs text-muted-foreground">{stat.detail}</dd>
            </div>
          ))}
        </dl>
        <figure className="mt-8 border-t border-border/60 pt-6">
          <blockquote className="text-base italic text-muted-foreground md:text-lg">
            “{recommendation.highlight}”
          </blockquote>
          <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
            {recommendation.author}, {recommendation.role}, {recommendation.company}
          </figcaption>
        </figure>
      </div>
    </FadeIn>
  );
}
