import { zodResolver } from "@hookform/resolvers/zod";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { SignUpFormValues, signUpSchema } from "~/schemas/auth";

export default function Index() {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  useEffect(() => {
    register("fullname");
    register("username");
    register("email");
    register("password");
    register("confirmPassword");
  }, [register]);

  const handleNext = async () => {
    let isValid = false;

    // Validate current step fields
    switch (step) {
      case 0:
        isValid = await trigger("fullname");
        break;
      case 1:
        isValid = await trigger("username");
        break;
      case 2:
        isValid = await trigger("email");
        break;
      case 3:
        isValid = await trigger(["password", "confirmPassword"]);
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (step === 3) {
        // Final step - submit the form
        handleSubmit(onSubmit)();
      } else {
        setStep(step + 1);
      }
    }
  };

  const onSubmit = (data: SignUpFormValues) => {
    console.log("Form Data:", data);
    // handle Supabase sign-up here
  };

  return (
    <View className="flex-1 min-h-screen p-5 bg-background">
      <SafeAreaView className="mt-20">
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
        >
          <Image
            source={require("~/assets/images/favicon.png")}
            style={{ width: 50, height: 50 }}
            resizeMode="cover"
          />
          <Text className="text-4xl font-bold text-foreground my-5">
            Create an Account
          </Text>
        </MotiView>

        {step === 0 && (
          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <View className="flex-col gap-3">
              <Label nativeID="fullname" className="native:text-xl font-normal">
                Tell us your full name
              </Label>
              <Input
                value={formData.fullname}
                placeholder="Jake Peralta"
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, fullname: text }));
                  setValue("fullname", text);
                }}
              />
              {errors.fullname && (
                <Text className="text-red-500">{errors.fullname.message}</Text>
              )}
            </View>
          </MotiView>
        )}
        {step === 1 && (
          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <View className="flex-col gap-3">
              <Label nativeID="username" className="native:text-xl font-normal">
                Now choose a fancy username
              </Label>
              <Input
                placeholder="jakyp"
                value={formData.username}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, username: text }));
                  setValue("username", text);
                }}
              />
              {errors.username && (
                <Text className="text-red-500">{errors.username.message}</Text>
              )}
            </View>
          </MotiView>
        )}
        {step === 2 && (
          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <View className="flex-col gap-3">
              <Label nativeID="email" className="native:text-xl font-normal">
                Please tell us your email
              </Label>
              <Input
                keyboardType="email-address"
                placeholder="peralta.jake@b99"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, email: text }));
                  setValue("email", text);
                }}
              />
              {errors.email && (
                <Text className="text-red-500">{errors.email.message}</Text>
              )}
            </View>
          </MotiView>
        )}
        {step === 3 && (
          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <View className="flex-col gap-3">
              <Label nativeID="email" className="native:text-xl font-normal">
                Now create a strong password
              </Label>
              <Input
                secureTextEntry
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, password: text }));
                  setValue("password", text);
                }}
              />
              <Input
                secureTextEntry
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, confirmPassword: text }));
                  setValue("confirmPassword", text);
                }}
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
              {errors.confirmPassword && (
                <Text className="text-red-500">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </MotiView>
        )}
        <View className="gap-3 flex-row self-end">
          {step > 0 && (
            <Button className="mt-5 self-end" onPress={() => setStep(step - 1)}>
              <Text>Back</Text>
            </Button>
          )}
          <Button className="mt-5 self-end" onPress={handleNext}>
            <Text>{step === 3 ? "Create Profile" : "Next"}</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
