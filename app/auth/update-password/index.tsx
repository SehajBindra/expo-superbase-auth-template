import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, SafeAreaView, TouchableOpacity, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { MotiView } from "moti";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import InputGroup from "~/components/core/InputGroup";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";

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

const UpdatePasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData: UpdatePasswordValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        reset();
        return;
      }

      setIsSuccess(true);
      Alert.alert("Success!", "Your password has been updated successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/");
          },
        },
      ]);
      reset();
    } catch (error) {
      console.error("PASSWORD UPDATE ERROR: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      reset();
    }
  };

  if (isSuccess) {
    return (
      <View className="w-full h-screen bg-background">
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
              Password Updated!
            </Text>
            <Text className="text-center text-muted-foreground mb-8">
              Your password has been successfully updated. You can now use your
              new password to log in.
            </Text>
            <Button onPress={() => router.replace("/(tabs)")}>
              <Text>Continue</Text>
            </Button>
          </View>
        </MotiView>
      </View>
    );
  }

  return (
    <MotiView
      from={{ translateX: "50%", opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{
        translateX: { type: "timing", duration: 500 },
        opacity: { type: "timing", duration: 500 },
      }}
    >
      <SafeAreaView>
        <View className="w-full flex flex-row items-center gap-2 mt-20">
          <TouchableOpacity
            className="w-12 h-12 flex items-center justify-center"
            onPress={() => router.back()}
          >
            <ChevronLeft size={25} />
          </TouchableOpacity>
          <Text className="text-3xl font-bold">Update Your Password</Text>
        </View>
        <View className="w-full h-screen bg-bacakground flex flex-col gap-5 px-5">
          <SafeAreaView className="flex flex-col ">
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
                    isPassword={true}
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
                    isPassword={true}
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
                disabled={isSubmitting}
              >
                <Text>
                  {isSubmitting ? "Updating Password..." : "Update Password"}
                </Text>
              </Button>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </MotiView>
  );
};

export default UpdatePasswordForm;
