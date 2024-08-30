import { z } from "zod";

const requiredString = z.string().min(1, "Required");

const profileImageSchema = z
  .custom()
  .refine((file) => {
    if (typeof file === "string") {
      return true;
    }
    return !file || file.type.startsWith("image/");
  }, "Must be an image file")
  .refine((file) => {
    if (typeof file === "string") {
      return true;
    }
    return !file || file.size < 1024 * 1024 * 2;
  }, "File must be less than 2 MB");

const resumeUploadSchema = z
  .custom()
  .refine((file) => {
    if (typeof file === "string") {
      return true;
    }
    return file.size <= 5 * 1024 * 1024;
  }, "File size must be 5MB or less")
  .refine((file) => {
    if (typeof file === "string") {
      return true;
    }
    return [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(file.type);
  }, "Invalid file type. Only PDF and DOC/DOCX are allowed.");

export const candidateProfileSchema = z.object({
  userName: requiredString.max(100),
  email: requiredString.max(100).email().readonly(),
  image: profileImageSchema,
  address: z.string().max(150).optional(),
  experience: z.string().max(50),
  resume: resumeUploadSchema,
});
