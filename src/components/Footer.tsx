export function Footer({ name }: { name: string }) {
  return (
    <footer className="bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-6 md:px-6">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
