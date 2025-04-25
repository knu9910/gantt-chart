import { NextResponse } from "next/server";

const DOORAY_API_BASE_URL = process.env.NEXT_PUBLIC_DOORAY_API_BASE_URL;
const DOORAY_SERVICE_API = process.env.NEXT_PUBLIC_DOORAY_SERVICE_API;

export async function GET() {
  try {
    if (!DOORAY_API_BASE_URL || !DOORAY_SERVICE_API) {
      return NextResponse.json(
        { error: "Dooray API credentials are not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${DOORAY_API_BASE_URL}/projects/3264535989135630815/posts`,
      {
        headers: {
          Authorization: `dooray-api ${DOORAY_SERVICE_API}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.ok, "나올까?");
    console.log(
      (await response.json()).result.map((post: any) => post.tags),
      "나올까?"
    );
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Dooray projects" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//  /project/v1/projects/{project-id}/milestones
// /project/v1/projects/{project-id}/posts
