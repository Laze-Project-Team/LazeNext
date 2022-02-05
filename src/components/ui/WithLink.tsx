import type { ReactNode, VFC } from 'react';
import { Fragment } from 'react';

import { StyledLink } from '@/components/ui/atoms/StyledLink';

type WithLinkProps = {
  title: string;
};

const regex = /\[(.*?)\]\((.*?)\)/;

export const WithLink: VFC<WithLinkProps> = ({ title }) => {
  let content = title;
  const contents: ReactNode[] = [];
  // eslint-disable-next-line no-cond-assign
  for (let match: RegExpMatchArray | null = null; (match = content.match(regex)); ) {
    if (match.index !== undefined) {
      if (match.index > 0) {
        contents.push(content.slice(0, match.index));
      }
      contents.push(<StyledLink href={match[2]}>{match[1]}</StyledLink>);
      content = content.slice(match.index + match[0].length);
    }
  }
  contents.push(content);

  return (
    <>
      {contents.map((content, i) => {
        return <Fragment key={i}>{content}</Fragment>;
      })}
    </>
  );
};
