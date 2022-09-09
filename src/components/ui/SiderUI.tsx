import { notification } from 'antd';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useState } from 'react';
import { VscEdit, VscFoldUp, VscRunAll } from 'react-icons/vsc';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { competeSlice } from '@/features/redux/compete';
import { explorerSlice } from '@/features/redux/explorer';
import type { RootState } from '@/features/redux/root';
import type { CompetitionByLevel, Competitor } from '@/typings/compete';

import { Editor as SiderEditor } from '../model/MonacoEditor/SiderEditor';
import { WasmCanvas } from '../model/WasmCanvas';

export const SiderUI: VFC = () => {
  const [t] = useTranslation('compete');

  const [key, setKey] = useState(0);

  const collapsed = useSelector<RootState, boolean>((state) => {
    return state.compete.collapsed;
  });
  const competitor = useSelector<RootState, Competitor>((state) => {
    return state.compete.competitor;
  });
  const competition = useSelector<RootState, CompetitionByLevel>((state) => {
    return state.compete.competition;
  });
  const dispatch = useDispatch();
  const { collapse } = competeSlice.actions;

  const openFetchError = (errorItem: string) => {
    notification.open({
      message: t(`fetch ${errorItem} error`),
      description: t(`fetch ${errorItem} error message`, { user: competitor.id }),
    });
  };

  const fetchCode = async () => {
    const url = encodeURI(`/api/compete/getcode?url=${competitor.programUrl}`);
    const res = await fetch(url, {
      method: 'GET',
    });
    if (res.ok) {
      return res.text();
    } else {
      openFetchError('code');
    }
  };

  const code = useQuery('code', fetchCode);

  const { setDirectory } = explorerSlice.actions;

  const onEditorLink = () => {
    if (code.isFetched && code.data) {
      dispatch(
        setDirectory({
          projectName: '',
          directory: {
            '/main.laze': {
              type: 'file',
              content: code.data,
              isRenaming: false,
            },
          },
        })
      );
    }
  };

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
        <div className="mx-auto aspect-video">
          <WasmCanvas
            wasmUrl={`/api/compete/getwasm?url=${competitor.wasmUrl}`}
            dependencies={['std', 'console', 'graphics', 'arduino', 'linetrace']}
            key={key.toString()}
          />
        </div>
      </div>
      <div className="h-6 min-w-fit bg-background pl-4 !text-[#cccccc]">
        <button
          className="relative inline-flex h-full items-center space-x-1 border-b-2 border-transparent px-3 transition-all ease-linear hover:border-primary-400 hover:text-primary-400 disabled:!text-gray-500 disabled:hover:!border-transparent dark:hover:border-primary-100 dark:hover:text-primary-100 disabled:dark:!text-gray-400"
          onClick={() => {
            setKey(key + 1);
          }}
        >
          <VscRunAll />
          <span> Run </span>
        </button>
        <Link
          href={`/compete/editor?id=${competition?.id ?? ''}&name=${competition?.name ?? ''}&level=${
            competition?.level ?? ''
          }`}
          passHref
        >
          <button
            className="relative inline-flex h-full items-center space-x-1 border-b-2 border-transparent px-3 transition-all ease-linear hover:border-primary-400 hover:text-primary-400 disabled:!text-gray-500 disabled:hover:!border-transparent dark:hover:border-primary-100 dark:hover:text-primary-100 disabled:dark:!text-gray-400"
            onClick={() => {
              onEditorLink();
            }}
          >
            <VscEdit />
            <span>Edit in the Editor</span>
          </button>
        </Link>
      </div>
      <div className="h-[51%] w-full bg-background pl-4 pr-4 pb-4">
        {competitor.publish ? (
          code.isFetched && code.data !== undefined ? (
            <SiderEditor code={code.isFetched ? code.data : ''} key={competitor.id} />
          ) : (
            <>
              <p>Loading...</p>
            </>
          )
        ) : (
          <span className="text-gray-300">{t('not_published')}</span>
        )}
      </div>
    </>
  );
};
