import type { FC } from 'react';

export type iconProps = {
  className?: string;
};

export const QiitaIcon: FC<iconProps> = (props) => {
  return (
    <>
      <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" {...props}>
        <g id="favicon">
          <g id="&lt;Group&gt;">
            <path
              id="&lt;Path&gt;"
              fill="currentColor"
              d="m487.6 496.5c9.3 6.2 19.1 9.9 28.6 11.4c-54.5 56.8-131.2 92.1-216.2 92.1c-165.7 0-300-134.4-300-300.1c0-165.8 134.3-300.2 300-300.2c165.7 0 300 134.4 300 300.2c0 50.9-12.7 98.8-35.1 140.8c-11.7-7.3-30.7-8.4-48.5-4.3c-11.8 2.8-22.4-13.7-29.1-22.3c-6.9-8.8-5.8-17.7-2-28.2c8.2-22.5 11.4-46.2 8.5-77c-5.1-54.6-27.8-102.7-61.2-138l-2.5-61.9c-0.8-9.7-11.1-15.3-19.2-10.4l-43.4 26.3c-27.6-12-58-17.3-89.3-14.1c-36.6 3.7-69.8 18.4-97.2 40.9l-46.2-11.2c-8.9-2.1-17.3 6.6-15.1 15.7l13.3 52.6c-22.9 39.8-34.3 88.4-29.5 139.6c11.3 120.3 104.7 168.4 212.5 157.5c53.2-5.4 97.2-16.7 129.5-51.2c8.4 18.7 24.2 29.9 42.1 41.8z"
            />
            <path
              id="&lt;Path&gt;"
              fill="currentColor"
              d="m421 245.4l27.3 5.2l-0.6 5.7l-26-5.6c0.5 3.3 1 5.1 1.4 8.5c6.6 70.9-48.9 96.6-119.7 103.7c-70.8 7.2-130-6.8-136.7-77.8c-0.3-3.4-0.4-5.2-0.5-8.5l-24 11.2l-1.2-6.2l25.2-10.3c0-4.4 0.3-7.2 0.8-11.5l-27.6 2.2l-0.2-5l28.3-2.3c0.5-3.8 1.2-6.1 2.1-9.8l-32.4-3.5l0.3-6.5l33 5c13.4-50.9 57.1-90.7 112.3-96.2c55.3-5.6 104.2 23.1 126.7 70.5l33.7-11.7l1 6.4l-31.6 10.1q2.3 5.2 4.1 10.6l28.8-3.5l0.4 5.1l-28.1 3.4c1.3 4 2.3 6.6 3.2 10.8z"
            />
          </g>
        </g>
      </svg>
    </>
  );
};
