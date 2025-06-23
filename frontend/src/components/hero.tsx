export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
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
