import { useEffect, useState } from 'react';

const getCurrentMedia = (mediaList: string[]) => {
  let result: null | string = null;
  for (const media of mediaList) {
    if (window.matchMedia(media).matches) {
      result = media;
      break;
    }
  }
  return result;
};

const useMediaQuery = (mediaList: string[]) => {
  const [current, setCurrent] = useState(getCurrentMedia(mediaList));

  useEffect(() => {
    let mounted = true;
    let timeout: null | NodeJS.Timeout = null;
    const onResize = () => {
      if (timeout) return;

      const media = getCurrentMedia(mediaList);
      setCurrent((prev) => (prev === media ? prev : media));

      timeout = setTimeout(() => (timeout = null), 100);
    };

    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return current;
};

export default useMediaQuery;
