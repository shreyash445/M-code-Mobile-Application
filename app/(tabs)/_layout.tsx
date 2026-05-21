import { Tabs, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../../constants/MorseData';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.mute,
        tabBarStyle: {
          backgroundColor: THEME.canvasSoft,
          borderTopColor: THEME.canvasWarm,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: THEME.canvas,
          borderBottomColor: THEME.canvasWarm,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: THEME.ink,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          letterSpacing: 1.5,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            activeOpacity={0.6}
            style={{ marginRight: 16 }}
          >
            <MaterialCommunityIcons name="cog-outline" size={22} color={THEME.ink} />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Translator',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="swap-horizontal" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="telegraph"
        options={{
          title: 'Telegraph',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="radio-tower" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Reference',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="book-open-variant" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}