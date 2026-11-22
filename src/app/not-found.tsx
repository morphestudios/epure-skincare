import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-pad">
      <div className="container-page max-w-xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-5xl text-espresso">Page not found</h1>
        <p className="mt-4 text-muted">
          The page you requested is not part of the ÉPURE storefront.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back home
        </Link>
      </div>
    </div>
  );
}
