const size = {
  lineWidth: {
    none: 0, // 없음
    micro: 1, // 매우 작음
    small: 2, // 작음
    medium: 3, // 중간
    large: 4, // 큼
    xlarge: 5, // 매우 큼
    xxlarge: 6, // 매우 매우 큼
  },
  borderRadius: {
    none: 0, // 없음
    small: 4, // 작음
    medium: 8, // 중간
    large: 12, // 큼
    xlarge: 16, // 매우 큼
    xxlarge: 20, // 매우 매우 큼
  },
  block: {
    none: 0, // 없음
    small: 50, // 작음
    medium: 100, // 중간
    large: 150, // 큼
    xlarge: 200, // 매우 큼
    xxlarge: 250, // 매우 매우 큼
  },
  relative: {
    none: '0%' as const, // 없음
    small: '25%' as const, // 작음
    medium: '50%' as const, // 중간
    large: '75%' as const, // 큼
    full: '100%' as const, // 매우 큼
  },
};

export default size;