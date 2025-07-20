import { router } from "expo-router";
import React from "react";
import { Image, SafeAreaView, View } from "react-native";

import { useAuth } from "~/components/core/AuthContext";
import ProfileAction from "~/components/core/ProfileAction";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";

import { LogOut, SunMoon, UserPen } from "lucide-react-native";

const profileActions = [
  {
    icon: <UserPen size={20} />,
    label: "Edit Profile",
    link: "profile/edit-profile",
  },
  {
    icon: <SunMoon size={20} />,
    label: "App Theme",
    link: "profile/preferences",
  },
];

const ProfilePage = () => {
  const { loading, session, profile } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("SIGN OUT ERROR: ", error);
      }
      router.replace("/");
    } catch (error) {
      console.error("SIGN OUT ERROR: ", error);
    }
  };

  return (
    <View>
      <SafeAreaView>
        <View className="mt-10 px-5 flex flex-col gap-5">
          <View className="flex flex-col gap-2 mb-5">
            <Text className="text-3xl font-semibold text-foreground">
              Profile
            </Text>
            <Text className="text-muted-foreground">
              Manage your profile, change theme preferences or delete your
              account.
            </Text>
          </View>
          <View className="flex flex-row items-center gap-4 border-b border-muted pb-3">
            <Image
              source={require("~/assets/images/favicon.png")}
              alt="User Profile"
              className="w-10 h-10 object-contain"
            />
            <View className="flex flex-col">
              <Text className="text-xl font-medium">{profile?.full_name}</Text>
              <Text className="text-muted-foreground">
                @{profile?.username}
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-4">
            {profileActions.map((item, idx) => (
              <ProfileAction
                key={idx}
                icon={item.icon}
                label={item.label}
                link={item.link}
              />
            ))}
            <Button
              variant="destructive"
              className="flex flex-row items-center gap-1 self-end"
              onPress={handleSignOut}
            >
              <LogOut color="white" size={20} />
              <Text className="text-sm">Sign Out</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProfilePage;
