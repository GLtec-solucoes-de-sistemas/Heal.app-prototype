import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const graphqlResponse = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_API!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation Login($payload: LoginInput!) {
          login(payload: $payload) {
            accessToken
            refreshToken
          }
        }
      `,
      variables: { payload: { email, password } },
    }),
  }).then((res) => res.json());

  const tokens = graphqlResponse.data?.login;

  if (!tokens) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({
    success: true,
    accessToken: tokens.accessToken,
  });

  response.cookies.set("accessToken", tokens.accessToken, {
    httpOnly: false,
    secure: true,
    path: "/",
    sameSite: "strict",
  });

  response.cookies.set("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
  });

  return response;
}
