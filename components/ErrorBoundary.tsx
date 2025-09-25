
import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, commonStyles, spacing, borderRadius } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary details:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={[commonStyles.centerContent, { padding: spacing.lg }]}>
          <Icon name="warning" size={64} color={colors.warning} />
          <Text style={[commonStyles.heading, commonStyles.mt_lg, commonStyles.textCenter]}>
            Something went wrong
          </Text>
          <Text style={[commonStyles.textSecondary, commonStyles.mt_sm, commonStyles.textCenter]}>
            We&apos;re sorry, but something unexpected happened. Please try again.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              marginTop: spacing.lg,
            }}
            onPress={this.handleRetry}
          >
            <Text style={{ color: colors.background, fontWeight: '600' }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
