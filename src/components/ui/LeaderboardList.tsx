import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { VFC } from 'react';

import type { Competitor, LeaderboardListProps } from '@/typings/compete';

import { H2 } from './IndexLayout';

export const LeaderboardList: VFC<LeaderboardListProps> = ({ competitorList, sortOrder, rankingDataName }) => {
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
      return <Table dataSource={dataSource} columns={columns} />;
    }
  };
  return <>{renderTable()}</>;
};
