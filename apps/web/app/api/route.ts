import { document } from "@/lib/openapi";
import { NextResponse } from "next/server";

// Using nodejs runtime instead of edge to avoid 1MB bundle size limit

export function GET() {
  return NextResponse.json(document);
}
