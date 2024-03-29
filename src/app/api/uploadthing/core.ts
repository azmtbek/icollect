export const runtime = "nodejs";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
// import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .input(z.object({
      collectionId: z.number(),
      lang: z.string(),
    }))
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const user = await auth();
      console.log('req', req);
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { collectionId: input.collectionId, lang: input.lang };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
      await api.collection.updateImageUrl.mutate({ imageUrl: file.url, collectionId: metadata.collectionId });
      revalidatePath(`/${metadata.lang}/collection/${metadata.collectionId}`, "page");
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      // return { uploadedBy: metadata.userId, collectionId: metadata.collectionId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;