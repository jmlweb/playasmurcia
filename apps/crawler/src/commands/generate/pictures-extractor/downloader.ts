import download from 'image-downloader';

const MAX_CONCURRENT_DOWNLOADS = 4;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Downloader = () => {
  const queue: (() => Promise<download.DownloadResult>)[] = [];

  return async (pictureUrl: string, picturePath: string) => {
    const promiseCreator = () =>
      download
        .image({ url: pictureUrl, dest: picturePath, timeout: 4000 })
        .then(async (response) => {
          await sleep(500);
          return response;
        });
    queue.push(promiseCreator);
    
  };
};
