import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.generated";

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://codeskills.tech";
  const redirectTo = `${siteUrl}/auth/callback`;

  const response = NextResponse.redirect(siteUrl);

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }

  // Redirect to GitHub with PKCE cookies attached
  const githubRedirect = NextResponse.redirect(data.url);
  response.cookies.getAll().forEach((cookie) => {
    githubRedirect.cookies.set(cookie.name, cookie.value);
  });

  return githubRedirect;
}
