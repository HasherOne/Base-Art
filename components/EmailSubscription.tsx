
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/commonStyles';
import Icon from './Icon';
import { useEmailSubscription } from '../hooks/useEmailSubscription';
import { NotificationPreferences } from '../types';

interface EmailSubscriptionProps {
  onSubscriptionComplete?: (email: string, preferences: NotificationPreferences) => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  newArtworks: true,
  priceAlerts: true,
  auctionUpdates: true,
  marketingEmails: false,
  weeklyDigest: true,
};

export default function EmailSubscription({ onSubscriptionComplete }: EmailSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [emailError, setEmailError] = useState('');
  
  const {
    subscription,
    isSubscribed,
    isVerified,
    isSubscribing,
    subscriptionError,
    subscribe,
    unsubscribe,
    updatePreferences,
  } = useEmailSubscription();

  console.log('EmailSubscription rendered, subscribed:', isSubscribed, 'subscription:', subscription);

  // Update local preferences when subscription changes
  useEffect(() => {
    if (subscription?.preferences) {
      setPreferences(subscription.preferences);
    }
  }, [subscription]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    console.log('Toggling preference:', key);
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubscribe = async () => {
    console.log('Attempting to subscribe with email:', email);
    
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');

    const success = await subscribe(email.trim(), preferences);
    if (success) {
      onSubscriptionComplete?.(email.trim(), preferences);
      Alert.alert(
        'Subscription Successful!',
        'You&apos;ve been subscribed to notifications. You can update your preferences anytime.',
        [{ text: 'OK' }]
      );
    } else if (subscriptionError) {
      Alert.alert(
        'Subscription Failed',
        subscriptionError,
        [{ text: 'OK' }]
      );
    }
  };

  const handleUnsubscribe = async () => {
    console.log('Unsubscribing from email notifications');
    
    Alert.alert(
      'Unsubscribe',
      'Are you sure you want to unsubscribe from all email notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unsubscribe',
          style: 'destructive',
          onPress: async () => {
            const success = await unsubscribe();
            if (success) {
              Alert.alert(
                'Unsubscribed',
                'You have been unsubscribed from email notifications.',
                [{ text: 'OK' }]
              );
            } else if (subscriptionError) {
              Alert.alert(
                'Unsubscribe Failed',
                subscriptionError,
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  const handleUpdatePreferences = async () => {
    console.log('Updating notification preferences');
    
    const success = await updatePreferences(preferences);
    if (success) {
      Alert.alert(
        'Preferences Updated',
        'Your notification preferences have been updated successfully.',
        [{ text: 'OK' }]
      );
    } else if (subscriptionError) {
      Alert.alert(
        'Update Failed',
        subscriptionError,
        [{ text: 'OK' }]
      );
    }
  };

  if (isSubscribed && subscription) {
    return (
      <View style={styles.container}>
        <View style={styles.subscribedHeader}>
          <View style={styles.successIcon}>
            <Icon name="checkmark-circle" size={24} color={colors.success} />
          </View>
          <View style={styles.subscribedInfo}>
            <Text style={styles.subscribedTitle}>Email Notifications Active</Text>
            <Text style={styles.subscribedEmail}>{subscription.email}</Text>
            {!isVerified && (
              <Text style={styles.verificationText}>Email verification pending</Text>
            )}
          </View>
        </View>

        {subscriptionError && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={16} color={colors.error} />
            <Text style={styles.errorText}>{subscriptionError}</Text>
          </View>
        )}

        <Text style={styles.preferencesTitle}>Notification Preferences</Text>
        
        <View style={styles.preferencesList}>
          {Object.entries(preferences).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.preferenceItem}
              onPress={() => togglePreference(key as keyof NotificationPreferences)}
              disabled={isSubscribing}
            >
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceName}>
                  {getPreferenceLabel(key as keyof NotificationPreferences)}
                </Text>
                <Text style={styles.preferenceDescription}>
                  {getPreferenceDescription(key as keyof NotificationPreferences)}
                </Text>
              </View>
              <View style={[styles.toggle, value && styles.toggleActive]}>
                {value && <Icon name="checkmark" size={16} color={colors.background} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={handleUpdatePreferences}
            disabled={isSubscribing}
          >
            <Text style={styles.updateButtonText}>
              {isSubscribing ? 'Updating...' : 'Update Preferences'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.unsubscribeButton]}
            onPress={handleUnsubscribe}
            disabled={isSubscribing}
          >
            <Text style={styles.unsubscribeButtonText}>Unsubscribe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.securityNote}>
          <Icon name="shield-checkmark" size={16} color={colors.success} />
          <Text style={styles.securityText}>
            You can update your preferences or unsubscribe at any time. We respect your privacy.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Email Notifications</Text>
      <Text style={styles.subtitle}>
        Stay updated with the latest digital art drops, price alerts, and auction updates.
      </Text>

      {subscriptionError && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{subscriptionError}</Text>
        </View>
      )}

      <View style={styles.emailInputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={[styles.emailInput, emailError && styles.emailInputError]}
          placeholder="Enter your email address"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSubscribing}
        />
        {emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}
      </View>

      <Text style={styles.preferencesTitle}>What would you like to receive?</Text>
      
      <View style={styles.preferencesList}>
        {Object.entries(preferences).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={styles.preferenceItem}
            onPress={() => togglePreference(key as keyof NotificationPreferences)}
            disabled={isSubscribing}
          >
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceName}>
                {getPreferenceLabel(key as keyof NotificationPreferences)}
              </Text>
              <Text style={styles.preferenceDescription}>
                {getPreferenceDescription(key as keyof NotificationPreferences)}
              </Text>
            </View>
            <View style={[styles.toggle, value && styles.toggleActive]}>
              {value && <Icon name="checkmark" size={16} color={colors.background} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.subscribeButton, isSubscribing && styles.subscribeButtonDisabled]}
        onPress={handleSubscribe}
        disabled={isSubscribing}
      >
        <Text style={styles.subscribeButtonText}>
          {isSubscribing ? 'Subscribing...' : 'Subscribe to Notifications'}
        </Text>
      </TouchableOpacity>

      <View style={styles.privacyNote}>
        <Icon name="shield-checkmark" size={16} color={colors.success} />
        <Text style={styles.privacyText}>
          We respect your privacy. You can unsubscribe at any time and we never share your email.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

function getPreferenceLabel(key: keyof NotificationPreferences): string {
  const labels = {
    newArtworks: 'New Artworks',
    priceAlerts: 'Price Alerts',
    auctionUpdates: 'Auction Updates',
    marketingEmails: 'Marketing Emails',
    weeklyDigest: 'Weekly Digest',
  };
  return labels[key];
}

function getPreferenceDescription(key: keyof NotificationPreferences): string {
  const descriptions = {
    newArtworks: 'Get notified when new digital art is listed',
    priceAlerts: 'Receive alerts for price changes on watched items',
    auctionUpdates: 'Updates on auction bids and endings',
    marketingEmails: 'Promotional content and special offers',
    weeklyDigest: 'Weekly summary of marketplace activity',
  };
  return descriptions[key];
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: spacing.sm,
    flex: 1,
  },
  emailInputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emailInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.backgroundAlt,
  },
  emailInputError: {
    borderColor: colors.error,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  preferencesList: {
    marginBottom: spacing.lg,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundAlt,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  preferenceName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  subscribedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  successIcon: {
    marginRight: spacing.md,
  },
  subscribedInfo: {
    flex: 1,
  },
  subscribedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  subscribedEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  verificationText: {
    fontSize: 12,
    color: colors.warning,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  unsubscribeButton: {
    backgroundColor: colors.backgroundAlt,
    marginLeft: spacing.sm,
  },
  unsubscribeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.success + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.success + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  privacyText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 16,
  },
  securityText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 16,
  },
});
