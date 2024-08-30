import { z } from "zod";

const requiredString = z.string().min(1, "Required");

const companyLogoSchema = z
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

export const createCompanySchema = z.object({
  name: requiredString.max(100),
  email: requiredString.max(100).email(),
  logo: companyLogoSchema,
  url: z.string().max(100).optional(),
  address: z.string().max(100).optional(),
});
