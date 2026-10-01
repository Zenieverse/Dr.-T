export class AsyncWorker {
  private queue: Array<() => Promise<void>> = [];

  addTask(task: () => Promise<void>) {
    this.queue.push(task);
  }

  async flushQueue(): Promise<number> {
    let completed = 0;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
        completed++;
      }
    }
    return completed;
  }
}
