import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUsername, getItemsByAuthor } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import ItemCard from "@/components/item-card";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) return { title: "Usuario no encontrado" };
  return {
    title: profile.display_name || profile.username,
    description: profile.bio || `Perfil de ${profile.username} en codeskills.tech`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  const items = await getItemsByAuthor(profile.id, isOwner);
  const publishedItems = items.filter((i) => i.status === "published");
  const draftItems = items.filter((i) => i.status === "draft");
  const totalInstalls = items.reduce((sum, i) => sum + i.installs, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Profile header */}
      <div className="flex items-start gap-6">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.username}
            width={80}
            height={80}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl">
            {profile.username[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
          )}
          {profile.country && (
            <p className="mt-1 text-xs text-muted-foreground">
              📍 {profile.country}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 flex gap-6 border-y border-border py-4">
        <div className="text-center">
          <p className="text-lg font-bold text-accent">
            {publishedItems.length}
          </p>
          <p className="text-xs text-muted-foreground">Publicados</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-accent">
            {formatNumber(totalInstalls)}
          </p>
          <p className="text-xs text-muted-foreground">Instalaciones</p>
        </div>
      </div>

      {/* Published items */}
      {publishedItems.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Items publicados</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {publishedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Drafts (owner only) */}
      {isOwner && draftItems.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Borradores</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {draftItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {publishedItems.length === 0 && !isOwner && (
        <div className="mt-16 text-center">
          <span className="text-4xl">📭</span>
          <p className="mt-4 font-medium">Sin publicaciones aún</p>
        </div>
      )}
    </div>
  );
}
