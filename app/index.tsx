
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateScreen from '../screens/CreateScreen';

const tabs = [
  { key: 'home', title: 'Home', icon: 'home', activeIcon: 'home' },
  { key: 'marketplace', title: 'Explore', icon: 'search', activeIcon: 'search' },
  { key: 'create', title: 'Create', icon: 'add-circle-outline', activeIcon: 'add-circle' },
  { key: 'profile', title: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState('home');

  console.log('MainScreen rendered with activeTab:', activeTab);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'create':
        return <CreateScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <View style={{ flex: 1 }}>
          {renderActiveScreen()}
        </View>
        <BottomTabBar
          activeTab={activeTab}
          onTabPress={setActiveTab}
          tabs={tabs}
        />
      </View>
    </SafeAreaView>
  );
}
