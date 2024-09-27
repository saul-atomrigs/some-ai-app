import React from 'react';
import { render } from '@testing-library/react-native';
import AnalysisResultView from '../AnalysisResultView';

describe('AnalysisResultView', () => {
  it('renders correctly when analysisResult is provided', () => {
    const { getByText } = render(<AnalysisResultView analysisResult="Test Result" />);
    expect(getByText('Test Result')).toBeTruthy();
  });

  it('does not render when analysisResult is null', () => {
    const { queryByText } = render(<AnalysisResultView analysisResult={null} />);
    expect(queryByText('Test Result')).toBeNull();
  });
});