import { useRouter } from 'next/router';
import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { VscRefresh } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { linetraceTemplate } from '@/const/linetraceSample';
import { explorerSlice } from '@/features/redux/explorer';

export const ResetButton: VFC = () => {
  const [t] = useTranslation('editor');

  const { query } = useRouter();
  const levelID: string = typeof query.levelID === 'string' ? query.levelID : '';

  const dispatch = useDispatch();
  const { setDirectory } = explorerSlice.actions;

  const onClick = () => {
    dispatch(
      setDirectory({
        projectName: '',
        directory: {
          '/main.laze': {
            type: 'file',
            content: linetraceTemplate[levelID],
            isRenaming: false,
          },
        },
      })
    );
  };

  return (
    <>
      <EditorButton name={t('buttons.reset')} onClick={onClick} Icon={<VscRefresh />} />
    </>
  );
};
