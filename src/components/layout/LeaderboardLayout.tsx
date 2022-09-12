import { Layout } from 'antd';
import type { ReactNode, VFC } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { competeSlice } from '@/features/redux/compete';
import type { RootState } from '@/features/redux/root';
import type { Competitor } from '@/typings/compete';

import { SiderUI } from '../ui/SiderUI';
import { IndexFooter, IndexHeader } from './IndexLayout';

type LeaderboardLayoutProps = {
  children: ReactNode;
};

const LeaderboardLayout: VFC<LeaderboardLayoutProps> = ({ children }) => {
  const collapsed = useSelector<RootState, boolean>((state) => {
    return state.compete.collapsed;
  });
  const competitor = useSelector<RootState, Competitor>((state) => {
    return state.compete.competitor;
  });
  const dispatch = useDispatch();
  const { collapse } = competeSlice.actions;

  useEffect(() => {
    dispatch(collapse());
  }, [dispatch, collapse]);

  return (
    <>
      <Layout className="flex !min-h-screen flex-col overflow-x-hidden">
        <Layout
          onClick={() => {
            if (!collapsed) dispatch(collapse());
          }}
        >
          <Layout.Header className="z-[1] w-full !px-2">
            <IndexHeader />
          </Layout.Header>
          <Layout.Content className="mx-auto w-[60rem] max-w-full flex-1 px-4 pt-4">{children}</Layout.Content>
          <Layout.Footer className="!bg-[#333344]">
            <IndexFooter />
          </Layout.Footer>
        </Layout>
        <Layout.Sider
          style={{
            zIndex: 10,
            backgroundColor: 'whitesmoke',
            position: 'fixed',
            overflow: 'hidden',
            height: '100vh',
            right: 0,
          }}
          width="450px"
          collapsible
          collapsedWidth={0}
          reverseArrow
          trigger={null}
          collapsed={collapsed}
          className="drop-shadow-lg"
        >
          {!collapsed ? <SiderUI key={competitor.id} /> : <></>}
        </Layout.Sider>
      </Layout>
    </>
  );
};

export { LeaderboardLayout };
