import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-semibold mb-4 text-text-primary">
          ByondWork
        </h1>
        <p className="text-xl text-text-secondary mb-12 leading-relaxed">
          Sports & wellness platform connecting corporate professionals with activities that matter.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="btn-primary px-8 py-3"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-secondary px-8 py-3"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
