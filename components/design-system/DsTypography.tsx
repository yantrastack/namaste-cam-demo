export function DsTypography() {
  return (
    <section className="space-y-12" id="typography">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight">01 Typography</h2>
      </div>
      <div className="space-y-8 rounded-lg bg-surface-container-lowest p-10 shadow-sm">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Display Header One
            </h1>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Header Two Authority
            </h2>
            <h3 className="text-2xl font-bold">Header Three Subsection</h3>
            <h4 className="text-xl font-bold">Header Four Title</h4>
            <h5 className="text-lg font-bold">Header Five Detail</h5>
            <h6 className="text-base font-bold">Header Six Caption</h6>
          </div>
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-stone-400">
                Body Regular
              </p>
              <p className="text-lg leading-relaxed">
                The aroma of fresh saffron infusion fills the air, promising a
                culinary journey unlike any other. Our stones are seasoned by
                time and tradition.
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-stone-400">
                Body Medium
              </p>
              <p className="text-lg font-medium leading-relaxed">
                Crafting excellence through precise measurements and passion.
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-stone-400">
                Link Styles
              </p>
              <a
                className="font-bold text-primary underline decoration-2 underline-offset-4 hover:underline"
                href="#typography"
              >
                Explore the Menu
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
