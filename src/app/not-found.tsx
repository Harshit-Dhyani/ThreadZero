import Link from "next/link";

export default function NotFound() {
  return <section className="mx-auto max-w-document px-5 py-20 md:px-8"><h1 className="text-4xl font-semibold">Page not found</h1><p className="mt-4 text-muted">This route is not part of the local ThreadZero concept.</p><Link className="mt-7 inline-flex min-h-11 items-center rounded-control bg-civic-600 px-5 font-semibold text-white" href="/">Return home</Link></section>;
}
