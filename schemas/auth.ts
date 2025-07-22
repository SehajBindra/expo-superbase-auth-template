import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LogInFormValues = z.infer<typeof loginSchema>;

export const completeProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
