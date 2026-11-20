import { api } from "./api";
import { compressImage } from "./image";

/** Uploads an image through the Fixora server (ImgBB) and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const form = new FormData();
  form.append("image", compressed);
  const { url } = await api<{ url: string }>("/api/upload", { method: "POST", auth: true, body: form });
  return url;
}