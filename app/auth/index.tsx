import React, { useState } from "react";
import { Image, SafeAreaView, View } from "react-native";

import AuthForm from "~/components/core/AuthForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";

const Register = () => {
  const [value, setValue] = useState("login");
  return (
    <View className="w-full h-screen px-5">
      <SafeAreaView className="flex flex-col gap-10">
        <View className="flex flex-row items-center justify-center gap-4 mt-10">
          <Image
            source={require("assets/images/favicon.png")}
            alt="App Icon"
            width={50}
            height={50}
            className="inline"
          />
          <Text className="text-foreground text-3xl font-bold">Auth+</Text>
        </View>
        <View className="flex flex-col gap-4">
          <Text className="text-2xl font-bold text-center">
            Expo+Supabase Auth
          </Text>
          <Text className="text-sm text-center w-4/5 mx-auto">
            Create an Account or Log In to experience the full user management
            flow, powered by Supabase; Fast, reliable and secure!
          </Text>
        </View>
        <View>
          <Tabs value={value} onValueChange={setValue}>
            <TabsList className="flex flex-row items-center justify-between rounded-xl">
              <TabsTrigger value="login" className="w-1/2 rounded-lg">
                <Text>Login</Text>
              </TabsTrigger>
              <TabsTrigger value="signup" className="w-1/2 rounded-lg">
                <Text>Sign Up</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={value} className="mt-8">
              <AuthForm type={value} />
            </TabsContent>
          </Tabs>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Register;
