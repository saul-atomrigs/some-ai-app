import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AnalyzeButton from '../components/AnalyzeButton';

describe('AnalyzeButton', () => {
  it('renders button with correct text when not loading and no analysisResult', () => {
    const { getByText } = render(<AnalyzeButton loading={false} imageUri={null} analysisResult={null} onPress={() => {}} />);
    expect(getByText('분석하기')).toBeTruthy();
  });

  it('renders button with correct text when not loading and analysisResult is present', () => {
    const { getByText } = render(<AnalyzeButton loading={false} imageUri={null} analysisResult="Some result" onPress={() => {}} />);
    expect(getByText('다른 대화 선택하기')).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<AnalyzeButton loading={false} imageUri={null} analysisResult={null} onPress={onPressMock} />);
    fireEvent.press(getByText('분석하기'));
    expect(onPressMock).toHaveBeenCalled();
  });
});