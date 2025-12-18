import { app } from './app';
import { startWorker } from './core/worker.service';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startWorker();
});
