import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import type { VFC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import { StyledLink } from '@/components/ui/atoms/StyledLink';
import type { directoryObject } from '@/features/docs/getProps';
import { cx } from '@/features/utils/cx';

type IndexListTreeProps = {
  dir: directoryObject;
  active: string;
};

const IndexListTree: VFC<IndexListTreeProps> = ({ dir, active }) => {
  const activeClass = cx(active.startsWith(dir.path) && 'indexlist-active');

  const [activeKey, setActiveKey] = useState<string[]>([]);
  const handleChange: CollapseProps['onChange'] = (key) => {
    setActiveKey(typeof key === 'string' ? [key] : key);
  };

  useEffect(() => {
    if (active.startsWith(dir.path)) {
      setActiveKey((key) => {
        if (!key.includes(dir.path)) {
          return [dir.path, ...key];
        } else {
          return key;
        }
      });
    }
  }, [active, dir.path]);

  return (
    <>
      {dir.children.length === 0 ? (
        <div key={`leaf-${dir.path}`} className={cx('indexlist-item', activeClass)}>
          <StyledLink
            href={`/docs${dir.path}`}
            className="inline-block h-full w-full text-gray-700 hover:text-gray-700"
          >
            {dir.name}
          </StyledLink>
        </div>
      ) : (
        <Collapse
          bordered={false}
          ghost
          expandIconPosition="right"
          key={dir.path}
          className={activeClass}
          activeKey={activeKey}
          onChange={handleChange}
        >
          <Collapse.Panel header={dir.name} key={dir.path} showArrow={true}>
            <IndexList indexList={dir.children} active={active} />
          </Collapse.Panel>
        </Collapse>
      )}
    </>
  );
};

type IndexListProps = {
  indexList: directoryObject[];
  active: string;
  nest?: number;
};

export const IndexList: VFC<IndexListProps> = ({ indexList, active }) => {
  return (
    <div className="indexlist flex select-none flex-col">
      {indexList.map((dir) => {
        return <IndexListTree dir={dir} active={active} key={dir.path} />;
      })}
    </div>
  );
};
