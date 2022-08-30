import type { ButtonProps } from 'antd';
import { Input, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useState } from 'react';
import { VscArchive } from 'react-icons/vsc';

import type { SubmitRequest } from '@/pages/api/compete/submit';

import { EditorButton } from './EditorButton';

export const SubmitButton: VFC = () => {
  const [t] = useTranslation('editor');

  const { query } = useRouter();
  const difficulty = (query.difficulty ?? 'Easy') as string;

  const [isSubmitOpen, setSelectOpen] = useState(false);
  const [linetraceTime, setLinetraceTime] = useState(0);
  const [competitorName, setCompetitorName] = useState('');
  const [submitButtonProps, setSubmitButtonProps] = useState<ButtonProps>({ disabled: true });

  const onClick = () => {
    setSelectOpen(true);
    setLinetraceTime(window.laze?.props?.variables?.linetraceTime ?? 0);
    setSubmitButtonProps({});
  };

  const submit = () => {
    // hardcode
    const data: SubmitRequest = {
      competition: 'linetrace',
      level: difficulty,
      time: window.laze?.props?.variables?.linetraceTime ?? 0,
      programUrl: window.laze?.props?.variables?.programUrl,
      wasmUrl: window.laze?.props?.variables?.wasmUrl,
      name: competitorName,
    };
    const body = new Blob([JSON.stringify(data)]);
    fetch('/api/compete/submit', {
      method: 'PUT',
      body,
    });
    setSelectOpen(false);
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
      return <p>Your time is: {linetraceTime}</p>;
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
        <Input
          placeholder="Enter name."
          value={competitorName}
          onChange={(e) => {
            setCompetitorName(e.target.value);
          }}
        />
        <br></br>
        <br></br>
        {renderSubmitError()}
      </Modal>
      <EditorButton name={`Submit`} onClick={onClick} Icon={<VscArchive />} />
    </>
  );
};
