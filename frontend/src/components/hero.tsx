export function Hero() {
  return (
    <section className="w-full py-6 md:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
              Bloomberg Terminal but Cooler
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Top hedge funds use AllMind data and compute to find α.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
