import { useEffect, useState } from 'react';

const getCurrentMedia = (mediaList: string[]) => {
  if (typeof window === 'undefined') {
    return null;
  }
  let result: null | string = null;
  for (let i = 0; i < mediaList.length; i++) {
    if (window.matchMedia(mediaList[i]).matches) {
      result = mediaList[i];
      break;
    }
  }
  return result;
};

export const useMediaQuery = (mediaList: string[]) => {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    setCurrent(getCurrentMedia(mediaList));

    let timeout: null | NodeJS.Timeout = null;
    const onResize = () => {
      if (timeout) return;

      const media = getCurrentMedia(mediaList);
      setCurrent((prev) => {
        return prev === media ? prev : media;
      });

      timeout = setTimeout(() => {
        return (timeout = null);
      }, 100);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [mediaList]);

  return current;
};
