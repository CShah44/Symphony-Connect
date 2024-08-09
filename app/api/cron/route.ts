import { Story } from "@/lib/database/models/story.model";
import { connect } from "../../../lib/database/index";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const now = new Date();

    const expiryDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await Story.deleteMany({ createdAt: { $lt: expiryDate } });

    return NextResponse.json({
      ok: true,
      message: "Successfully deleted stories!",
    });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
