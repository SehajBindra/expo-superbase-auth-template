import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, TouchableOpacity, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import InputGroup from "@/components/core/InputGroup";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";

export const updatePasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

function parseHashParams(hash: string) {
  return hash
    .substring(1)
    .split("&")
    .reduce((acc, item) => {
      const [key, value] = item.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);
}

const UpdatePasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Hydrate recovery session from URL hash
  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log("Supabase client initialized:", !!supabase);
        console.log("Supabase auth:", !!supabase.auth);
        
        const hash = window.location.hash;
        console.log("Current URL hash:", hash);
        
        if (!hash) {
          console.error("No recovery token found in URL");
          return;
        }

        const params = parseHashParams(hash);
        console.log("Parsed params:", {
          hasAccessToken: !!params.access_token,
          hasRefreshToken: !!params.refresh_token,
          type: params.type,
        });

        if (params.access_token && params.refresh_token) {
          console.log("Recovery tokens found, proceeding directly...");
          console.log("Tokens:", {
            access_token: params.access_token.substring(0, 50) + "...",
            refresh_token: params.refresh_token
          });
          
        
          console.log("Recovery session ready (bypassing setSession)");
          setSessionReady(true);

          // Remove hash from URL
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        } else {
          console.error("Missing required tokens in URL");
        }
      } catch (error) {
        console.error("Error in session initialization:", error);
        Alert.alert("Error", "Failed to initialize recovery session.");
      }
    };

    initializeSession();
  }, []);

  const onSubmit = async (formData: UpdatePasswordValues) => {
    setIsLoading(true);

    try {
      // Get the recovery tokens
      const tokens = (window as any).recoveryTokens;
      if (!tokens) {
        Alert.alert("Error", "Recovery session expired. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("Updating password via API route...");
      
      // Use our custom API route
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        }),
      });

      console.log("API response status:", response.status);
      const result = await response.json();
      console.log("API response:", result);

      if (!response.ok) {
        console.error("API error:", result);
        Alert.alert("Error", result.error?.message || "Failed to update password");
        setIsLoading(false);
        reset();
        return;
      }

      console.log("Password updated successfully via API:", result);
      setIsSuccess(true);
      setIsLoading(false);
      reset();
      
      // Clean up stored tokens
      delete (window as any).recoveryTokens;
    } catch (error) {
      console.error("PASSWORD UPDATE ERROR:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setIsLoading(false);
      reset();
    }
  };

  if (!sessionReady) {
    return (
      <View className="w-full h-screen flex items-center justify-center px-5">
        <Text className="text-lg text-muted-foreground">
          Preparing recovery session...
        </Text>
      </View>
    );
  }

  if (isSuccess) {
    return (
      <View className="w-full h-screen flex items-center justify-center px-5">
        <Text className="text-2xl font-bold text-center mb-4">
          Password Updated!
        </Text>
        <Text className="text-center text-muted-foreground mb-8">
          Your password has been successfully updated. You can now log in with
          your new password.
        </Text>
        <Button onPress={() => router.replace("/")}>
          <Text>Continue</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="w-full h-screen bg-background">
      <SafeAreaView>
        <View className="w-full flex flex-row items-center gap-2 pt-10">
          <TouchableOpacity
            className="w-12 h-12 flex items-center justify-center"
            onPress={() => router.push("/")}
          />
          <Text className="text-3xl font-bold">Update Your Password</Text>
        </View>

        <View className="w-full h-screen bg-background flex flex-col gap-5 px-5">
          <SafeAreaView className="flex flex-col">
            <View className="mb-4">
              <Text className="text-muted-foreground">
                Enter your new password below. Make sure it's strong and secure.
              </Text>
            </View>
            <View className="flex flex-col gap-5">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputGroup
                    label="New Password"
                    placeholder="Enter your new password"
                    isPassword
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputGroup
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    isPassword
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

              <Button
                size="lg"
                className="native:rounded-2xl mt-4"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <Text>
                  {isLoading ? "Updating Password..." : "Update Password"}
                </Text>
              </Button>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default UpdatePasswordForm;
