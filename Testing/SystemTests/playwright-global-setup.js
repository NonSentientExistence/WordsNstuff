export default async () => {
  // Global teardown will run after all tests
  return async () => {
    if (process.env.SLOW_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };
};
