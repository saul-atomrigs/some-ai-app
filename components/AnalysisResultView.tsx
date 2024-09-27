import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

interface AnalysisResultViewProps {
  analysisResult: string | null;
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ analysisResult }) => {
  if (!analysisResult) return null;

  return (
    <View style={styles.analysisResultContainer}>
      <Text style={styles.analysisResultText}>{analysisResult}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  analysisResultContainer: {
    width: size.relative.large,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: size.borderRadius.medium,
    borderWidth: size.lineWidth.small,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  analysisResultText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    textAlign: 'center',
  },
});

export default AnalysisResultView;