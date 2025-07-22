import React, { useState } from "react";
import { KeyboardTypeOptions, TouchableOpacity, View } from "react-native";

import { Eye, EyeOff } from "lucide-react-native";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";

interface InputGroupProps {
  label: string;
  type?: KeyboardTypeOptions;
  placeholder?: string;
  isPassword?: boolean;
  error?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  value?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  type = "default",
  placeholder,
  isPassword = false,
  error,
  onChangeText,
  onBlur,
  value,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const showPassword = isPassword && !isVisible;

  return (
    <View className="flex flex-col gap-2">
      <Label nativeID={label}>{label}</Label>
      <View className="relative w-full">
        <Input
          keyboardType={type}
          placeholder={placeholder}
          secureTextEntry={showPassword}
          autoCapitalize="none"
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
          {...rest}
          className="w-full"
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
            onPress={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <EyeOff size={18} className="text-muted-foreground" />
            ) : (
              <Eye size={18} className="text-muted-foreground" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500">{error}</Text>}
    </View>
  );
};

export default InputGroup;
