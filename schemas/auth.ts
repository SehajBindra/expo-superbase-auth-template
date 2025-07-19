import { z } from "zod";

export const signUpSchema = z
  .object({
    // fullname: z.string().min(3, "Full name is required"),
    // username: z.string().min(3, "Username is required"),
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
