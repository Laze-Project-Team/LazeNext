import { Button, Modal, Switch } from 'antd';
import type { VFC } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscSettingsGear } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { colorModeContext } from '@/pages/_app';

type closeButtonProps = {
  onClick: () => void;
};

const CloseButton: VFC<closeButtonProps> = ({ onClick }) => {
  const [t] = useTranslation('editor');

  return (
    <Button type="primary" onClick={onClick}>
      {t('settings.close')}
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
      <Modal visible={isShown} title={t('buttons.settings')} onCancel={close} footer={<CloseButton onClick={close} />}>
        <div className="flex items-center px-4">
          <span>{t('settings.darkmode')}</span>
          <Switch className="!ml-auto" onChange={handleChange} checked={colorMode ? colorMode[0] === 'dark' : false} />
        </div>
      </Modal>

      <EditorButton name={t('buttons.settings')} onClick={onClick} Icon={<VscSettingsGear />} />
    </>
  );
};
