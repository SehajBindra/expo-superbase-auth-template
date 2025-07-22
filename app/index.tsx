import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { Toaster } from "sonner-native";
import { useAuth } from "~/components/core/AuthContext";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";

const HomePage = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        setIsSigningOut(false);
        router.replace("/auth");
      }
    }
  }, [session, loading, router]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("SIGN OUT ERROR: ", error);
        setIsSigningOut(false);
      }
    } catch (err) {
      setIsSigningOut(false);
      console.log("SIGN OUT CATCH ERROR: ", err);
    }
  };

  return (
    <View className="h-screen items-center justify-center bg-background">
      {session ? (
        <View className="flex flex-col gap-5 items-center">
          <Text className="text-4xl font-bold">User Signed In</Text>
          <Text className="">{session.user.email}</Text>
          <Button onPress={handleSignOut} disabled={isSigningOut}>
            <Text>{isSigningOut ? "Signing Out" : "Sign Out"}</Text>
          </Button>
          <Button onPress={() => router.push("/auth/update-password")}>
            <Text>Update Password</Text>
          </Button>
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
      {/* //! Cannot setup toaster: react-native-gesture-handler error */}
      <Toaster />
    </View>
  );
};

export default HomePage;
