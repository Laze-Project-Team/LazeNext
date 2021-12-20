import { Button, Modal, Switch } from 'antd';
import type { VFC } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscSettingsGear } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { colorModeContext } from '@/pages/editor';

type closeButtonProps = {
  onClick: () => void;
};

const CloseButton: VFC<closeButtonProps> = ({ onClick }) => {
  const [t] = useTranslation('editor');

  return (
    <Button type="primary" onClick={onClick}>
      {t('close')}
    </Button>
  );
};

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
      <Modal visible={isShown} title={t('Settings')} onCancel={close} footer={<CloseButton onClick={close} />}>
        <div>
          <span>{t('Enable Dark Mode')}</span>
          <Switch onChange={handleChange} checked={colorMode ? colorMode[0] === 'dark' : false} />
        </div>
      </Modal>

      <EditorButton name={t('Settings')} onClick={onClick} Icon={<VscSettingsGear />} />
    </>
  );
};
