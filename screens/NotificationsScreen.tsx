
import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { commonStyles, colors, spacing, borderRadius } from '../styles/commonStyles';
import Icon from '../components/Icon';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types';

export default function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  console.log('NotificationsScreen rendered with', notifications.length, 'notifications');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return 'heart';
      case 'purchase':
        return 'bag';
      case 'sale':
        return 'trending-up';
      case 'follow':
        return 'person-add';
      case 'bid':
        return 'hammer';
      case 'auction_end':
        return 'time';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return colors.error;
      case 'purchase':
      case 'sale':
        return colors.success;
      case 'follow':
        return colors.primary;
      case 'bid':
      case 'auction_end':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        commonStyles.card,
        commonStyles.mb_sm,
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: notification.read ? colors.surface : colors.backgroundAlt,
          borderLeftWidth: notification.read ? 0 : 3,
          borderLeftColor: colors.primary,
        }
      ]}
      onPress={() => {
        if (!notification.read) {
          markAsRead(notification.id);
        }
        console.log('Notification pressed:', notification.title);
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: borderRadius.full,
          backgroundColor: colors.backgroundAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        {notification.image ? (
          <Image
            source={{ uri: notification.image }}
            style={{
              width: 48,
              height: 48,
              borderRadius: borderRadius.full,
            }}
            resizeMode="cover"
          />
        ) : (
          <Icon
            name={getNotificationIcon(notification.type)}
            size={24}
            color={getNotificationColor(notification.type)}
          />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[
          commonStyles.text,
          notification.read ? {} : commonStyles.textBold,
          { fontSize: 14, marginBottom: 2 }
        ]}>
          {notification.title}
        </Text>
        <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
          {notification.message}
        </Text>
        <Text style={[commonStyles.textLight, { fontSize: 11 }]}>
          {formatTime(notification.createdAt)}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          padding: spacing.xs,
          marginLeft: spacing.sm,
        }}
        onPress={() => {
          removeNotification(notification.id);
          console.log('Notification removed:', notification.id);
        }}
      >
        <Icon name="close" size={16} color={colors.textLight} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.spaceBetween, commonStyles.px_md, commonStyles.py_md]}>
        <View style={commonStyles.row}>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: borderRadius.full,
              backgroundColor: colors.backgroundAlt,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
            }}
            onPress={onBack}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={[commonStyles.subtitle, { fontSize: 24 }]}>
              Notifications
            </Text>
            <Text style={commonStyles.textSecondary}>
              {notifications.filter(n => !n.read).length} unread
            </Text>
          </View>
        </View>
        {notifications.some(n => !n.read) && (
          <TouchableOpacity
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.md,
              backgroundColor: colors.primary,
            }}
            onPress={() => {
              markAllAsRead();
              console.log('Mark all as read pressed');
            }}
          >
            <Text style={{ color: colors.background, fontWeight: '600', fontSize: 12 }}>
              Mark All Read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length > 0 ? (
          notifications.map(renderNotification)
        ) : (
          <View style={[commonStyles.centerContent, { paddingTop: spacing.xxl }]}>
            <Icon name="notifications-off" size={64} color={colors.textLight} />
            <Text style={[commonStyles.heading, commonStyles.mt_lg]}>
              No notifications
            </Text>
            <Text style={[commonStyles.textSecondary, commonStyles.mt_sm, commonStyles.textCenter]}>
              You&apos;re all caught up! New notifications will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
