
import { useState, useEffect } from 'react';
import { useAsyncStorage } from './useAsyncStorage';
import { EmailSubscription, NotificationPreferences } from '../types';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  newArtworks: true,
  priceAlerts: true,
  auctionUpdates: true,
  marketingEmails: false,
  weeklyDigest: true,
};

export function useEmailSubscription() {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  
  const { 
    storedValue: subscription, 
    setValue: setSubscription, 
    loading: subscriptionLoading 
  } = useAsyncStorage<EmailSubscription | null>('emailSubscription', null);

  console.log('useEmailSubscription hook - subscription:', subscription);

  const subscribe = async (
    email: string, 
    preferences: NotificationPreferences = DEFAULT_PREFERENCES
  ): Promise<boolean> => {
    console.log('Subscribing email:', email, 'with preferences:', preferences);
    setIsSubscribing(true);
    setSubscriptionError(null);

    try {
      // Validate email
      if (!isValidEmail(email)) {
        throw new Error('Invalid email address');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newSubscription: EmailSubscription = {
        email: email.trim().toLowerCase(),
        preferences,
        subscribedAt: new Date().toISOString(),
        verified: true, // In real app, this would be false until email verification
      };

      await setSubscription(newSubscription);
      console.log('Email subscription successful:', newSubscription);
      return true;
    } catch (error) {
      console.error('Email subscription failed:', error);
      setSubscriptionError(error instanceof Error ? error.message : 'Subscription failed');
      return false;
    } finally {
      setIsSubscribing(false);
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    console.log('Unsubscribing from email notifications');
    setIsSubscribing(true);
    setSubscriptionError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await setSubscription(null);
      console.log('Email unsubscription successful');
      return true;
    } catch (error) {
      console.error('Email unsubscription failed:', error);
      setSubscriptionError('Failed to unsubscribe. Please try again.');
      return false;
    } finally {
      setIsSubscribing(false);
    }
  };

  const updatePreferences = async (newPreferences: NotificationPreferences): Promise<boolean> => {
    if (!subscription) {
      setSubscriptionError('No active subscription found');
      return false;
    }

    console.log('Updating notification preferences:', newPreferences);
    setIsSubscribing(true);
    setSubscriptionError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedSubscription: EmailSubscription = {
        ...subscription,
        preferences: newPreferences,
      };

      await setSubscription(updatedSubscription);
      console.log('Preferences updated successfully:', updatedSubscription);
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setSubscriptionError('Failed to update preferences. Please try again.');
      return false;
    } finally {
      setIsSubscribing(false);
    }
  };

  const verifyEmail = async (verificationCode: string): Promise<boolean> => {
    if (!subscription) {
      setSubscriptionError('No subscription found to verify');
      return false;
    }

    console.log('Verifying email with code:', verificationCode);
    setIsSubscribing(true);
    setSubscriptionError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const verifiedSubscription: EmailSubscription = {
        ...subscription,
        verified: true,
      };

      await setSubscription(verifiedSubscription);
      console.log('Email verification successful');
      return true;
    } catch (error) {
      console.error('Email verification failed:', error);
      setSubscriptionError('Invalid verification code. Please try again.');
      return false;
    } finally {
      setIsSubscribing(false);
    }
  };

  const isSubscribed = !!subscription;
  const isVerified = subscription?.verified ?? false;

  return {
    subscription,
    isSubscribed,
    isVerified,
    isSubscribing,
    subscriptionError,
    subscriptionLoading,
    subscribe,
    unsubscribe,
    updatePreferences,
    verifyEmail,
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
