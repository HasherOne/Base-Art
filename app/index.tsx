
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import CreateScreen from '../screens/CreateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { useWalletContext } from '../contexts/WalletContext';
import WalletConnection from '../components/WalletConnection';

const tabs = [
  { key: 'home', title: 'Home', icon: 'home', activeIcon: 'home' },
  { key: 'marketplace', title: 'Market', icon: 'storefront-outline', activeIcon: 'storefront' },
  { key: 'create', title: 'Create', icon: 'add-circle-outline', activeIcon: 'add-circle' },
  { key: 'profile', title: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const { isConnected, walletInfo, connectWallet } = useWalletContext();

  console.log('App rendered, wallet connected:', isConnected);

  useEffect(() => {
    // Show welcome message when wallet is connected
    if (isConnected && walletInfo) {
      console.log('Wallet connected, showing welcome');
      setTimeout(() => {
        Alert.alert(
          'Welcome to the Future of Digital Art! 🎨',
          `Your ${walletInfo.provider} wallet is connected and ready to trade on Base blockchain.\n\nStart exploring exclusive digital artworks and collections.`,
          [{ text: 'Let\'s Go!' }]
        );
      }, 1000);
    }
  }, [isConnected, walletInfo]);

  const handleTabPress = (tab: string) => {
    if (!isConnected && tab !== 'home') {
      Alert.alert(
        'Wallet Required',
        'Please connect your crypto wallet to access this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Connect Wallet', onPress: () => setActiveTab('home') }
        ]
      );
      return;
    }
    
    console.log('Tab pressed:', tab);
    setActiveTab(tab);
    setShowNotifications(false);
  };

  const renderScreen = () => {
    if (!isConnected) {
      return <WalletConnection onWalletConnected={() => console.log('Wallet connected from main screen')} />;
    }

    if (showNotifications) {
      return <NotificationsScreen onBack={() => setShowNotifications(false)} />;
    }

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {isConnected && (
        <BottomTabBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
          tabs={tabs}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
