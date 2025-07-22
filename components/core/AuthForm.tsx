import React, { useState } from "react";
import { Alert, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { MotiView } from "moti";
import { Controller, useForm } from "react-hook-form";

import { router } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";
import {
  LogInFormValues,
  loginSchema,
  SignUpFormValues,
  signUpSchema,
} from "~/schemas/auth";
import InputGroup from "./InputGroup";

const AuthForm = ({ type }: { type: string }) => {
  const isLogin = type === "login";

  const [step, setStep] = useState(0);

  const {
    reset,
    control,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LogInFormValues | SignUpFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : signUpSchema),
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (formData: LogInFormValues | SignUpFormValues) => {
    try {
      if (type === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          Alert.alert(error.message);
          reset();
          return;
        }
        reset();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          Alert.alert(error.message);
          reset();
          return;
        }
        reset();
        router.replace("/profile/complete-profile");
      }
    } catch (error) {
      console.error("SIGN IN ERROR: ", error);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger(["email"]);
    if (isValid) {
      setStep(1);
    }
  };

  const handleBack = () => {
    setStep(0);
  };

  if (type === "login") {
    return (
      <MotiView
        key={type}
        from={{ translateX: "50%", opacity: 0 }}
        animate={{ translateX: 0, opacity: 1 }}
      >
        <View className="flex flex-col gap-5">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputGroup
                label="Email"
                type="email-address"
                placeholder="jakeyp@b99.com"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputGroup
                label="Password"
                placeholder="Enter your password"
                isPassword={true}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.password?.message}
              />
            )}
          />
          {/* //TODO: FORGOT PASSWORD YET TO BE IMPLEMENTED */}
          <Text className="text-muted-foreground self-end underline">
            Forgot Password?
          </Text>
          <Button
            size="lg"
            disabled={isSubmitting}
            className="native:rounded-2xl"
            onPress={handleSubmit(onSubmit)}
          >
            <Text>{isSubmitting ? "Logging In..." : "Login"}</Text>
          </Button>
        </View>
      </MotiView>
    );
  }

  return (
    <MotiView
      key={type}
      from={{ translateX: "50%", opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
    >
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
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup
                  label="Email"
                  type="email-address"
                  placeholder="jakeyp@b99.com"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />
          )}

          {step === 1 && (
            <>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputGroup
                    label="Password"
                    placeholder="Enter your password"
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
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    isPassword={true}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value ?? ""}
                    error={
                      "confirmPassword" in errors
                        ? errors.confirmPassword?.message
                        : undefined
                    }
                  />
                )}
              />
            </>
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
                  {isSubmitting ? "Creating Account..." : "Create Account"}
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
  );
};

export default AuthForm;
