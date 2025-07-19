import React from "react";
import { KeyboardTypeOptions, View } from "react-native";
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
}) => (
  <View className="flex flex-col gap-2">
    <Label nativeID={label}>{label}</Label>
    <Input
      keyboardType={type}
      placeholder={placeholder}
      secureTextEntry={isPassword}
      autoCapitalize="none"
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value}
      {...rest}
    />
    {error && <Text className="text-red-500">{error}</Text>}
  </View>
);

export default InputGroup;
