import { useContext, VFC } from 'react';
import { useState } from 'react';
import { Modal, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { VscSettingsGear } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';

import { colorModeContext } from '@/pages/editor';

export const SettingsButton: VFC = () => {
  const [t] = useTranslation('editor');
  const [isShown, setIsShown] = useState(false);

  const onClick = () => {
    setIsShown(true);
  };

  const close = () => {
    setIsShown(false);
  };

  const colorMode = useContext(colorModeContext);
  const handleChange = (checked: boolean) => {
    if (colorMode) {
      colorMode[1](checked ? 'dark' : 'light');
    }
  };

  return (
    <>
      <Modal visible={isShown} title={t('Settings')} closable afterClose={close}>
        <div>
          <span>{t('Enable Dark Mode')}</span>
          <Switch onChange={handleChange} />
        </div>
      </Modal>

      <EditorButton name={t('Settings')} onClick={onClick} Icon={<VscSettingsGear />} />
    </>
  );
};
