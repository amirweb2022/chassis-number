"use client";
import Link from "next/link";
type PdfViewerProps = {
  url: string;
  title: string;
}

export default function PdfViewer({ url, title }: PdfViewerProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-zinc-800 rounded-full" />
        <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          Document
        </span>
      </div>
      <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
        <iframe
          src={`${url}#view=FitH`}
          title={`${title} PDF`}
          className="w-full"
          style={{ height: "480px" }}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-400 text-right">
        Viewing:{" "}
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-zinc-600 transition-colors"
        >
          open in new tab
        </Link>
      </p>
    </div>
  );
}