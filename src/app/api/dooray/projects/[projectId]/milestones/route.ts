import { NextResponse } from "next/server";

const DOORAY_API_BASE_URL = process.env.NEXT_PUBLIC_DOORAY_API_BASE_URL;
const DOORAY_SERVICE_API = process.env.NEXT_PUBLIC_DOORAY_SERVICE_API;

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    if (!DOORAY_API_BASE_URL || !DOORAY_SERVICE_API) {
      return NextResponse.json(
        { error: "Dooray API credentials are not configured" },
        { status: 500 }
      );
    }

    const url = `${DOORAY_API_BASE_URL}/projects/${params.projectId}/milestones`;

    console.log("Fetching milestones from URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `dooray-api ${DOORAY_SERVICE_API}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch Dooray milestones", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.result);
  } catch (error) {
    console.error("Error fetching Dooray milestones:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
