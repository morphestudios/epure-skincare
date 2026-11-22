import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="border border-line bg-surface px-8 py-16 text-center">
      <h2 className="font-display text-3xl text-espresso">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-muted">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn btn-primary mt-8">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
