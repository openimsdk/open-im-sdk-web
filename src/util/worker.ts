function create(fun: any) {
  const blob = new Blob(["(" + fun + ")()"]);
  const url = window.URL.createObjectURL(blob);
  const worker = new Worker(url);
  return worker;
}

export const createWorker = (callback: () => void, time: number) => {
  const pollingWorker = create(`function (e) {
      setInterval(function () {
        this.postMessage(null)
      }, ${time})
    }`);
  pollingWorker.onmessage = callback;
  return pollingWorker;
};

export const stopWorker = (instance: Worker) => {
  try {
    instance && instance.terminate();
  } catch (err) {
    console.log(err);
  }
};
