import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { SessionProvider } from "@/context/authentication";
import { ColorProvider } from "@/components/UIelements/DialogComponent/ColorContext";

export default function RootLayout() {
  return (
    <ColorProvider>
      <SessionProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(app)" />
        </Stack>
      </SessionProvider>
    </ColorProvider>
  );
}
