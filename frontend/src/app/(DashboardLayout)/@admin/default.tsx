export default function AdminDefaultPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Welcome to Admin Dashboard
      </h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        Manage users, courses, analytics, and platform settings from here.
      </p>
    </div>
  );
}
