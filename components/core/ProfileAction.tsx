import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "../ui/text";

interface ProfileActionProps {
  icon: React.ReactNode;
  label: string;
  link: string;
}

const ProfileAction = ({ icon, label, link }: ProfileActionProps) => (
  <View className="flex flex-row gap-2 items-center py-2">
    <View className="w-12 h-12 flex items-center justify-center bg-muted rounded-full">
      {icon}
    </View>
    <Link href={`/${link}`} className="text-lg font-medium flex-1 w-full">
      <Text className="text-foreground">{label}</Text>
    </Link>
    <ChevronRight size={20} />
  </View>
);

export default ProfileAction;
