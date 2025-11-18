export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full py-2 z-10 relative">
      <div className="container flex items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} VerifyAI. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
