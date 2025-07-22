import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { MotiView } from "moti";
import { Controller, useForm } from "react-hook-form";

import InputGroup from "~/components/core/InputGroup";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";
import {
  CompleteProfileFormValues,
  completeProfileSchema,
} from "~/schemas/auth";

const CompleteProfilePage = () => {
  const [step, setStep] = useState(0);

  const {
    reset,
    control,
    trigger,
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
      // Navigate to main app or dashboard
      router.replace("/profile");
    } catch (error) {
      console.error("COMPLETE PROFILE ERROR: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleNext = async () => {
    const isValid = await trigger(["username"]);
    if (isValid) {
      setStep(1);
    }
  };

  const handleBack = () => {
    setStep(0);
  };

  return (
    <SafeAreaView>
      <View className="mt-10 px-5">
        <MotiView
          from={{ translateX: "50%", opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
        >
          <Text className="text-3xl font-bold mb-5">Complete Your Profile</Text>
          <MotiView
            key={step}
            from={{ translateX: "50%", opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{
              delay: 100,
            }}
          >
            <View className="flex flex-col gap-5">
              {step === 0 && (
                <>
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
                  <Link
                    href="/"
                    className="self-end text-muted-foreground my-5 underline"
                  >
                    Do it later in settings
                  </Link>
                </>
              )}

              {step === 1 && (
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
              )}

              {step === 0 ? (
                <Button
                  size="lg"
                  className="native:rounded-2xl"
                  onPress={handleNext}
                >
                  <Text>Next</Text>
                </Button>
              ) : (
                <View className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="native:rounded-2xl"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    <Text>
                      {isSubmitting
                        ? "Completing Profile..."
                        : "Complete Profile"}
                    </Text>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="native:rounded-2xl"
                    onPress={handleBack}
                  >
                    <Text>Back</Text>
                  </Button>
                </View>
              )}
            </View>
          </MotiView>
        </MotiView>
      </View>
    </SafeAreaView>
  );
};

export default CompleteProfilePage;
