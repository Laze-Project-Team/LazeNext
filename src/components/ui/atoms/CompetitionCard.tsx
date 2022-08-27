import { Card } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import type { VFC } from 'react';

import type { Competition } from '@/typings/compete';

const { Meta } = Card;

type CompetitionCardProps = {
  competition: Competition;
};

export const CompetitionCard: VFC<CompetitionCardProps> = ({ competition }) => {
  return (
    <Link href={`/compete/${competition.id}`} passHref>
      <Card
        hoverable
        cover={
          <Image src="/img/competition/linetrace.png" alt="linetrace" layout="responsive" width="500" height="300" />
        }
        className="active:blur-[1px]"
      >
        <Meta title={competition.name} description="CLICK TO JOIN" />
      </Card>
    </Link>
  );
};
