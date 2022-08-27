import type { VFC } from 'react';
import { useContext } from 'react';
import { VscEdit, VscFoldUp, VscRunAll } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';

import { competeSlice } from '@/features/redux/compete';
import type { RootState } from '@/features/redux/root';
import { cx } from '@/features/utils/cx';
import { ratioRefContext } from '@/pages/editor';
import styles from '@/styles/canvas.module.css';
import type { Competitor } from '@/typings/compete';

import { Editor as SiderEditor } from '../model/MonacoEditor/SiderEditor';

export const SiderUI: VFC = () => {
  const collapsed = useSelector<RootState, boolean>((state) => {
    return state.compete.collapsed;
  });
  const competitor = useSelector<RootState, Competitor>((state) => {
    return state.compete.competitor;
  });
  const dispatch = useDispatch();
  const { collapse } = competeSlice.actions;
  const ratioRef = useContext(ratioRefContext);

  return (
    <>
      <div className="flex h-16 !bg-[#102539]">
        <div
          className="h-16 w-16 !bg-[#102539] p-6 align-middle text-xl font-normal !text-[#cccccc] hover:cursor-pointer hover:!bg-[#203549] hover:!text-[#ececec]"
          onClick={() => {
            if (!collapsed) dispatch(collapse());
          }}
        >
          <VscFoldUp className="rotate-90" />
        </div>
        <div className="flex h-16 !bg-[#102539] pt-2 pb-2">
          <div className="h-12 w-12 bg-laze-primary pt-2 text-center text-xl font-normal">
            <span>#{competitor.ranking}</span>
          </div>
          <div className="h-12 w-60 bg-gray-100 pt-2 pl-4 text-left text-xl font-normal">
            <span>{competitor.id}</span>
          </div>
        </div>
      </div>
      <div className="w-[450px] items-center pl-4 pr-4 pt-4">
        <div ref={ratioRef} className="mx-auto aspect-video">
          <canvas
            id="output-canvas"
            width="1280"
            height="720"
            className={cx('h-full w-full bg-white', styles.canvas)}
          />
        </div>
      </div>
      <div className="min-w-fit bg-background pl-4 !text-[#cccccc]">
        <button className="relative inline-flex h-full items-center space-x-1 border-b-2 border-transparent px-3 transition-all ease-linear hover:border-primary-400 hover:text-primary-400 disabled:!text-gray-500 disabled:hover:!border-transparent dark:hover:border-primary-100 dark:hover:text-primary-100 disabled:dark:!text-gray-400">
          <VscRunAll />
          <span> Run </span>
        </button>
        <button className="relative inline-flex h-full items-center space-x-1 border-b-2 border-transparent px-3 transition-all ease-linear hover:border-primary-400 hover:text-primary-400 disabled:!text-gray-500 disabled:hover:!border-transparent dark:hover:border-primary-100 dark:hover:text-primary-100 disabled:dark:!text-gray-400">
          <VscEdit />
          <span>Edit in the Editor</span>
        </button>
      </div>
      <div className="h-[51%] w-full bg-background pl-4 pr-4 pb-4">
        <SiderEditor code={`hello`} />
      </div>
    </>
  );
};
