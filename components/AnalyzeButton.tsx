import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

interface AnalyzeButtonProps {
  loading: boolean;
  imageUri: string | null;
  analysisResult: string | null;
  onPress: () => void;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ loading, imageUri, analysisResult, onPress }) => {
  return loading ? (
    <ActivityIndicator size='large' color='#0000ff' style={styles.loadingIndicator} />
  ) : (
    <TouchableOpacity
      style={[styles.analyzeButton, { backgroundColor: imageUri ? '#FF5722' : '#ccc' }]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.analyzeButtonText}>
        {analysisResult ? '다른 대화 선택하기' : '분석하기'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    marginTop: spacing.lg,
  },
  analyzeButton: {
    width: size.relative.large,
    paddingVertical: spacing.md,
    borderRadius: size.borderRadius.medium,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  analyzeButtonText: {
    color: colors.buttonText,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});

export default AnalyzeButton;