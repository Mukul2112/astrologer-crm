export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out min-h-screen w-full min-w-0">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
}
