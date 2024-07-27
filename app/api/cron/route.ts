import { deleteStoryCron } from "@/lib/actions/story.action";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await deleteStoryCron();
    return NextResponse.json({ ok: true, message: result });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
