import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/context/authentication';
import { Text, ActivityIndicator  } from 'react-native';


export default function Layout () {
    const { session, isLoading } = useSession();
    
    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!session) {
        console.log("test");
        return <Redirect href="/"/>
    }
    
    return <Stack 
        screenOptions={{
            headerShown: false,
        }}
    />
}