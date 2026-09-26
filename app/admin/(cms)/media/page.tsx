import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata: Metadata = { title: "Media Library" };

export default function MediaPage() {
  return (
    <>
      <PageHeader
        title="Media Library"
        description="Every uploaded image, video, icon and certificate. Files still used on the website can't be deleted by accident — you'll see where they are used first."
      />
      <MediaLibrary />
    </>
  );
}
