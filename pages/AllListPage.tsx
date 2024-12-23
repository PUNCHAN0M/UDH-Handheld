import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';
import HeaderComponent from '@/components/layouts/HeaderComponent';
import MenuCard from '@/components/UIelements/AllListComponent/MenuCard';
import { useRouter } from 'expo-router';

const DATA = [
  { icon: 'list', title: 'ดูใบสั่งยา', route: '/(auth)/Prescription' }, 
  { icon: 'inventory', title: 'สต๊อกสินค้า', route: '/(auth)/stockProduct' }, 
];

export default function AllListPage() {
  const router = useRouter();
  
  //ย้ายไปหน้า Stock สินค้า
  const handleScanBtn = (route: string) => {
    console.log(`Navigating to ${route}`);
    router.push(route as any); 
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <HeaderComponent
          showBackIcon={true}
          titleText={"รายการทั้งหมด"}
          showAccountIcon={true}
        />
        <View style={styles.container}>
          <FlatList
            data={DATA}
            renderItem={({ item }) => (
              <MenuCard
                icon={item.icon}
                title={item.title}
                onPress={() => handleScanBtn(item.route)}
              />
            )}
            keyExtractor={item => item.title}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapperStyle}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginVertical: 10,
  },
});
