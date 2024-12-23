import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SessionProvider } from '@/context/authentication';

export default function RootLayout () {
    return (
        <SessionProvider>
            <Stack 
                screenOptions={{
                    headerShown: false,
                }}
            >
            <Stack.Screen name='index'/>
            <Stack.Screen name="(app)"/>
        </Stack>
        </SessionProvider>
        
    );
}