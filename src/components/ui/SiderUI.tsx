import { notification } from 'antd';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useEffect } from 'react';
import { VscEdit, VscFoldUp, VscRunAll } from 'react-icons/vsc';
import { useQuery } from 'react-query';
import { connect, useDispatch, useSelector } from 'react-redux';

import { executeWasm } from '@/features/compete/compete';
import type { CompeteState } from '@/features/redux/compete';
import { competeSlice } from '@/features/redux/compete';
import { explorerSlice } from '@/features/redux/explorer';
import type { RootState } from '@/features/redux/root';
import { cx } from '@/features/utils/cx';
import styles from '@/styles/canvas.module.css';
import type { CompetitionByLevel, Competitor } from '@/typings/compete';

import { Editor as SiderEditor } from '../model/MonacoEditor/SiderEditor';

type SiderUIProps = {
  state: CompeteState;
};

const UnconnectedSiderUI: VFC<SiderUIProps> = ({ state }) => {
  const [t] = useTranslation('compete');

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

  const fetchWasm = async () => {
    const url = encodeURI(`/api/compete/getwasm?url=${competitor.wasmUrl}`);
    const res = await fetch(url, {
      method: 'GET',
    });
    if (res.ok) {
      return res.arrayBuffer();
    } else {
      openFetchError('wasm');
    }
  };
  const wasm = useQuery('wasm', fetchWasm);

  useEffect(() => {
    if (!state.collapsed) {
      if (wasm.data) {
        executeWasm(wasm.data) || executeWasm(wasm.data);
      }
    } else {
      if (window.laze?.props?.variables?.interval) {
        clearInterval(window.laze.props.variables.interval);
      }
    }
  }, [wasm, state]);

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
          <canvas
            id="output-canvas"
            width="1280"
            height="720"
            className={cx('h-full w-full bg-white', styles.canvas)}
          />
        </div>
      </div>
      <div className="h-6 min-w-fit bg-background pl-4 !text-[#cccccc]">
        <button
          className="relative inline-flex h-full items-center space-x-1 border-b-2 border-transparent px-3 transition-all ease-linear hover:border-primary-400 hover:text-primary-400 disabled:!text-gray-500 disabled:hover:!border-transparent dark:hover:border-primary-100 dark:hover:text-primary-100 disabled:dark:!text-gray-400"
          onClick={() => {
            if (wasm.isFetched && wasm.data) {
              executeWasm(wasm.data) || executeWasm(wasm.data);
            }
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
        {code.isFetched && code.data !== undefined ? (
          <SiderEditor code={code.isFetched ? code.data : ''} key={competitor.id} />
        ) : (
          <>
            <p>Loading...</p>
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    state: state.compete,
  };
};

export const SiderUI = connect(mapStateToProps)(UnconnectedSiderUI);
