import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = process.env.IMAGEKIT_PRIVATE_KEY
  ? new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY })
  : null;

function hasImageKitConfig() {
  return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}

function createFileName(originalName = "upload") {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `chat-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file) {
  if (imagekit) {
    try {
      const fileName = createFileName(file.originalname);
      const result = await imagekit.files.upload({
        file: await toFile(file.buffer, fileName, { type: file.mimetype }),
        fileName,
        folder: "/chat",
      });

      if (result && result.url) {
        return result.url;
      }
    } catch (error) {
      console.warn("ImageKit upload failed, falling back to base64 data URI:", error.message);
    }
  }

  // Fallback to base64 data URI if ImageKit is unconfigured or fails
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

export { uploadChatMedia, hasImageKitConfig };