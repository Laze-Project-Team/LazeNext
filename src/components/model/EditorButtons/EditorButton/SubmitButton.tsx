import type { ButtonProps } from 'antd';
import { Input, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { VscArchive } from 'react-icons/vsc';

import type { SubmitRequest } from '@/pages/api/compete/submit';

import { competeEditorExecuteParamContext } from '../compete';
import { EditorButton } from './EditorButton';

export const SubmitButton: VFC = () => {
  const [t] = useTranslation('editor');

  const { query } = useRouter();
  const level = (query.level ?? '') as string;
  const id = (query.id ?? '') as string;
  const name = (query.name ?? '') as string;

  const param = useContext(competeEditorExecuteParamContext);

  const [isSubmitOpen, setSelectOpen] = useState(false);
  const [linetraceTime, setLinetraceTime] = useState(0);
  const [competitorName, setCompetitorName] = useState('');
  const [submitButtonProps, setSubmitButtonProps] = useState<ButtonProps>({ disabled: true });

  const onClick = () => {
    setSelectOpen(true);
    setSubmitButtonProps({ disabled: true });
    if (param?.current.linetraceTime) {
      setLinetraceTime(param.current.linetraceTime.time);
      setSubmitButtonProps({});
    }
  };

  const submit = () => {
    const data: SubmitRequest = {
      competition: id,
      level: level,
      time: param?.current.linetraceTime?.time ?? 0,
      programUrl: param?.current.programUrl ?? '',
      wasmUrl: param?.current.wasmUrl ?? '',
      name: competitorName,
    };
    const body = new Blob([JSON.stringify(data)]);
    fetch('/api/compete/submit', {
      method: 'PUT',
      body,
    }).then(() => {
      setSelectOpen(false);
    });
  };

  const abort = () => {
    return void setSelectOpen(false);
  };

  const renderSubmitError = () => {
    if (!linetraceTime) {
      // harcode
      return (
        <>
          <p className="text-red-500">Run your linetrace simulation to set your time.</p>
        </>
      );
    } else {
      return <p>Your time is: {Number(linetraceTime.toFixed(2))}s</p>;
    }
  };

  return (
    <>
      <Modal
        title={'Submit to Competition'}
        visible={isSubmitOpen}
        afterClose={abort}
        onOk={submit}
        okButtonProps={submitButtonProps}
        onCancel={abort}
        cancelText={t('samples.cancel')}
        okText={'Submit'}
      >
        <div className="p-1">
          <span className="text-sm">
            {t('buttons.competition')}: {name}
          </span>
        </div>
        <div className="p-1 pt-0">
          <span className="text-sm">
            {t('buttons.level')}: {level}
          </span>
        </div>
        <Input
          className="p-1"
          addonBefore="Name: "
          placeholder="Enter name."
          value={competitorName}
          onChange={(e) => {
            setCompetitorName(e.target.value);
          }}
        />
        <div className="p-1">{renderSubmitError()}</div>
      </Modal>
      <EditorButton name={`Submit`} onClick={onClick} Icon={<VscArchive />} />
    </>
  );
};
