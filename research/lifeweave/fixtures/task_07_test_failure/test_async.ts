import { AsyncWorker } from './async_worker';

async function runTest() {
  const worker = new AsyncWorker();
  let executed = 0;

  worker.addTask(async () => {
    await new Promise(r => setTimeout(r, 10));
    executed++;
  });
  worker.addTask(async () => {
    await new Promise(r => setTimeout(r, 10));
    executed++;
  });

  const count = await worker.flushQueue();
  if (count !== 2 || executed !== 2) {
    console.error(`FAIL: Expected 2 executed tasks, got count=${count}, executed=${executed}`);
    process.exit(1);
  }

  console.log('PASS: AsyncWorker flushes and completes all queue tasks sequentially');
  process.exit(0);
}

runTest();
