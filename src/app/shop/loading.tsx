export default function ShopLoading() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <div className="skeleton h-10 w-40" />
        <div className="skeleton mt-4 h-16 w-80 max-w-full" />
        <div className="skeleton mt-10 h-40 w-full" />
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="space-y-3">
              <div className="skeleton aspect-[4/5] w-full" />
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-8 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
