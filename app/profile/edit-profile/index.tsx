import { router } from "expo-router";
import React from "react";
import { Alert, SafeAreaView, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { MotiView } from "moti";
import { Controller, useForm } from "react-hook-form";

import { ChevronLeft } from "lucide-react-native";
import InputGroup from "~/components/core/InputGroup";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";
import {
  CompleteProfileFormValues,
  completeProfileSchema,
} from "~/schemas/auth";

const EditProfilePage = () => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      username: "",
      fullName: "",
    },
  });

  const onSubmit = async (formData: CompleteProfileFormValues) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        Alert.alert("Error", "Unable to get user information");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          full_name: formData.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userData.user.id);

      if (error) {
        Alert.alert("Error", error.message);
        reset();
        return;
      }

      reset();
      router.replace("/profile");
    } catch (error) {
      console.error("COMPLETE PROFILE ERROR: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView>
      <View className="mt-10 px-5">
        <MotiView
          from={{ translateX: "50%", opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
        >
          <View className="flex flex-row gap-2">
            <Button
              size="icon"
              onPress={() => router.back()}
              className="bg-transparent p-0"
            >
              <ChevronLeft />
            </Button>
            <Text className="text-3xl font-bold mb-5">Edit Your Profile</Text>
          </View>
          <MotiView
            from={{ translateX: "50%", opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{
              delay: 100,
            }}
          >
            <View className="flex flex-col gap-5">
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputGroup
                    label="Full Name"
                    placeholder="John Doe"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.fullName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputGroup
                    label="Username"
                    placeholder="johndoe_99"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.username?.message}
                  />
                )}
              />

              <View className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="native:rounded-2xl"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  <Text>
                    {isSubmitting ? "Updating Profile..." : "Update Profile"}
                  </Text>
                </Button>
              </View>
            </View>
          </MotiView>
        </MotiView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfilePage;
