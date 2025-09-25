
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/commonStyles';
import Icon from './Icon';

interface TabItem {
  key: string;
  title: string;
  icon: string;
  activeIcon?: string;
}

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  tabs: TabItem[];
}

export default function BottomTabBar({ activeTab, onTabPress, tabs }: BottomTabBarProps) {
  console.log('BottomTabBar rendered with activeTab:', activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => {
                onTabPress(tab.key);
                console.log('Tab pressed:', tab.key);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name={isActive ? (tab.activeIcon || tab.icon) : tab.icon}
                  size={24}
                  color={isActive ? colors.primary : colors.text}
                />
              </View>
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? colors.primary : colors.text }
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: colors.backgroundAlt,
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
