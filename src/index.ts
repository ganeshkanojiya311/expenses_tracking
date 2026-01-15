import app from './app';
import { Config } from './config';

const startServe = () => {
  const PORT = Config.PORT || 4000;

  try {
    app.listen(PORT, () => {
      console.log('Server listening on port ', { port: PORT });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServe();
