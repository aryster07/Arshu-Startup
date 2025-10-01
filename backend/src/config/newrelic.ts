// Initialize New Relic monitoring if license key is provided
export const initializeNewRelic = (): void => {
  if (process.env.NEWRELIC_LICENSE_KEY && process.env.NODE_ENV === 'production') {
    try {
      require('newrelic');
      console.log('📊 New Relic monitoring initialized');
    } catch (error) {
      console.warn('⚠️  New Relic initialization failed:', error);
    }
  }
};