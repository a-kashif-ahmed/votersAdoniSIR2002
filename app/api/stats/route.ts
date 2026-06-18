import { NextResponse } from "next/server";
import { getSearchCount } from "@/lib/stats";

export async function GET() {
  return NextResponse.json({
    searches: getSearchCount(),
  });
}