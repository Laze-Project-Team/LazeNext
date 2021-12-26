import type { VFC } from 'react';

import type { sampleListType } from '@/typings/samplelist';

type SampleListProps = {
  samples: sampleListType;
  setSelect: React.Dispatch<React.SetStateAction<string | null>>;
};

export const SampleList: VFC<SampleListProps> = ({ samples, setSelect }) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    return void setSelect(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col space-y-1 dark:bg-[#3c3c3c] py-1 px-2 text-[#ccc] max-h-40 overflow-auto">
        {Object.keys(samples).map((key) => {
          return (
            <div key={key} className="">
              <input
                id={`samplelist-select-${key}`}
                type="radio"
                name="sample-select"
                onChange={handleChange}
                value={key}
                className="peer hidden"
              />
              <label
                htmlFor={`samplelist-select-${key}`}
                className="inline-block w-full cursor-pointer px-3 py-[0.2rem] bg-black/5 hover:bg-black/10 dark:hover:bg-white/5 transition-colors duration-100 dark:peer-checked:bg-primary-700 peer-checked:bg-primary-default rounded-sm"
              >
                {samples[key].name}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
};
