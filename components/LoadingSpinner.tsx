
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors, commonStyles, spacing } from '../styles/commonStyles';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'large', 
  text = 'Loading...', 
  color = colors.primary 
}: LoadingSpinnerProps) {
  return (
    <View style={[commonStyles.centerContent, { padding: spacing.lg }]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[commonStyles.textSecondary, commonStyles.mt_md]}>
          {text}
        </Text>
      )}
    </View>
  );
}
