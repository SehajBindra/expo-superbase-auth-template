import "react-native-reanimated";

import { PortalHost } from "@rn-primitives/portal";
import { Slot } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";
import "./globals.css";

if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}

export { ErrorBoundary } from "expo-router";

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  return (
    <>
      <Slot />
      <PortalHost />
    </>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add("bg-background");
  }, []);
}

function noop() {}
