module.exports = (api) => {
  // Get the platform from the API caller...
  const platform = api.caller((caller) => caller && caller.platform);

  return {
    presets: ['babel-preset-expo'],
    plugins: [platform === 'web' && 'custom-web-only-plugin'].filter(Boolean),
  };
};
