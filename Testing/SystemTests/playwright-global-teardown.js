export default async () => {
  if (process.env.SLOW_MODE) {
    console.log('Waiting 2 seconds before closing...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};
