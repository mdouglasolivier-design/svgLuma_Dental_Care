import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get("pageKey");

    if (pageKey) {
      const pageImage = await prisma.pageImage.findUnique({ where: { pageKey } });
      return NextResponse.json(pageImage || {});
    }

    const pageImages = await prisma.pageImage.findMany();
    return NextResponse.json(pageImages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch page images" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { pageKey, heroImage, heroTitle, heroSubtitle } = body;

    const pageImage = await prisma.pageImage.upsert({
      where: { pageKey },
      update: { heroImage, heroTitle, heroSubtitle },
      create: { pageKey, heroImage, heroTitle, heroSubtitle },
    });

    return NextResponse.json(pageImage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update page image" }, { status: 500 });
  }
}
