import InputGroup from "@/components/core/InputGroup";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { MotiView } from "moti";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, TouchableOpacity, View } from "react-native";
import z from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (formData: ResetPasswordValues) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: "exp://192.168.1.8:8081/--/auth/update-password",
        }
      );

      if (error) {
        Alert.alert(
          "Error",
          error.message || "Failed to send reset email. Please try again."
        );
        return;
      }

      console.log("PASS RESET DATA: ", data);
      setIsSuccess(true);
    } catch (error) {
      console.error("PASSWORD RESET ERROR: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      reset();
    }
  };

  if (isSuccess) {
    return (
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          scale: { type: "spring", duration: 600 },
          opacity: { type: "timing", duration: 400 },
        }}
      >
        <View className="w-full h-screen bg-background flex items-center justify-center px-5">
          <Text className="text-2xl font-bold text-center mb-4">
            Check Your Email
          </Text>
          <Text className="text-center text-muted-foreground mb-8">
            We've sent a password reset link to your email address.
          </Text>
          <Button onPress={() => router.back()}>
            <Text>Go Back</Text>
          </Button>
        </View>
      </MotiView>
    );
  }

  return (
    <MotiView
      from={{ translateX: "50%", opacity: 0 }}
      animate={{ translateX: "0", opacity: 1 }}
      transition={{
        translateX: { type: "timing", duration: 500 },
        opacity: { type: "timing", duration: 500 },
      }}
    >
      <View className="w-full h-screen bg-background">
        <View className="w-full py-1 flex flex-row items-center gap-2 mt-20">
          <TouchableOpacity
            className="w-12 h-12 flex items-center justify-center"
            onPress={() => router.back()}
          >
            <ChevronLeft size={25} />
          </TouchableOpacity>
          <Text className="text-3xl font-bold">Reset Your Password</Text>
        </View>

        <View className="my-5 px-5 flex flex-col gap-5">
          <Text className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputGroup
                label="Email Address"
                type="email-address"
                placeholder="jakeyp@b99.com"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Button
            size="lg"
            className="native:rounded-lg"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text>{isSubmitting ? "Sending..." : "Send Reset Email"}</Text>
          </Button>
        </View>
      </View>
    </MotiView>
  );
};

export default ResetPasswordPage;
