export function Footer({ name }: { name: string }) {
  return (
    <footer className="bg-background py-6">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <p className="text-center text-xs text-muted-foreground">
          Designed & Built by {name}. Inspired by Brittany Chiang.
        </p>
      </div>
    </footer>
  );
}
