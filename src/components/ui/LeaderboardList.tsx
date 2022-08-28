import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { competeSlice } from '@/features/redux/compete';
import type { RootState } from '@/features/redux/root';
import type { Competitor, LeaderboardListProps } from '@/typings/compete';

import { H2 } from './IndexLayout';

export const LeaderboardList: VFC<LeaderboardListProps> = ({ competitorList, sortOrder, rankingDataName }) => {
  const dispatch = useDispatch();
  const { collapse, differentCompetitor, toggleCollapse } = competeSlice.actions;
  const competitor = useSelector<RootState, Competitor>((state) => {
    return state.compete.competitor;
  });
  const collapsed = useSelector<RootState, boolean>((state) => {
    return state.compete.collapsed;
  });
  const dataSource = ((competitorList ?? []) as Competitor[])
    .slice()
    .sort((a, b) => {
      return (sortOrder === 'Ascending' ? 1 : -1) * (a.rankingData - b.rankingData);
    })
    .map((element, index) => {
      return {
        ...element,
        ranking: index + 1,
      };
    });
  const columns: ColumnsType<Competitor> = [
    {
      title: 'Ranking',
      dataIndex: 'ranking',
      key: 'ranking',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'id',
      key: 'id',
      width: '65%',
      align: 'left',
    },
    {
      title: rankingDataName,
      dataIndex: 'rankingData',
      key: 'rankingData',
      width: '30%',
      align: 'left',
    },
  ];
  const renderTable = () => {
    if (dataSource.length === 0) {
      return <H2 className="text-center">We do not have players yet.</H2>;
    } else {
      return (
        <Table
          dataSource={dataSource}
          columns={columns}
          onRow={(record) => {
            return {
              onClick: (e) => {
                e.stopPropagation();
                const checkedCompetitor = competitor ?? {
                  id: '',
                  ranking: 0,
                  rankingData: 0,
                  programUrl: '',
                  wasmUrl: '',
                };
                if (!collapsed && checkedCompetitor.ranking === record.ranking) {
                  return dispatch(collapse());
                } else if (!collapsed && checkedCompetitor.ranking !== record.ranking) {
                  return dispatch(differentCompetitor(record));
                } else {
                  return dispatch(toggleCollapse(record));
                }
              },
            };
          }}
        />
      );
    }
  };
  return <>{renderTable()}</>;
};
