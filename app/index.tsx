import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";

import { useAuth } from "~/components/core/AuthContext";

const HomePage = () => {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace("/profile/");
      } else {
        router.replace("/auth");
      }
    }
  }, [session, loading]);

  return (
    <View>
      <SafeAreaView>
        <View className="flex-1 h-screen items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomePage;
