import type { ButtonProps } from 'antd';
import { notification } from 'antd';
import { Checkbox } from 'antd';
import { Input, Modal } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useRef } from 'react';
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
  const levelID = (query.levelID ?? '') as string;
  const id = (query.id ?? '') as string;
  const name = (query.name ?? '') as string;

  const param = useContext(competeEditorExecuteParamContext);

  const [isSubmitOpen, setSelectOpen] = useState(false);
  const [linetraceTime, setLinetraceTime] = useState(0);
  const [competitorName, setCompetitorName] = useState('');
  const [submitButtonProps, setSubmitButtonProps] = useState<ButtonProps>({ disabled: true });

  const publish = useRef(true);

  const onClick = () => {
    setSelectOpen(true);
    setSubmitButtonProps({ disabled: true });
    if (param?.current.linetraceTime?.time) {
      setLinetraceTime(param.current.linetraceTime.time);
      setSubmitButtonProps({});
    }
  };

  const submit = () => {
    const data: SubmitRequest = {
      competition: id,
      level: levelID,
      time: param?.current.linetraceTime?.time ?? 0,
      programUrl: param?.current.programUrl ?? '',
      wasmUrl: param?.current.wasmUrl ?? '',
      name: competitorName,
      publish: publish.current,
    };
    const body = new Blob([JSON.stringify(data)]);
    fetch('/api/compete/submit', {
      method: 'PUT',
      body,
    }).then((res) => {
      if (res.status === 404) {
        notification.open({
          message: t('errors.SubmitFailed.title'),
          description: t('errors.SubmitFailed.message'),
          type: 'error',
          duration: 5,
          placement: 'bottomRight',
        });
      } else {
        notification.open({
          message: t('messages.SubmitSuccess.title'),
          description: t('messages.SubmitSuccess.message', {
            name: competitorName,
            time: Number(linetraceTime.toFixed(2)),
          }),
          type: 'success',
          placement: 'bottomRight',
          duration: 5,
        });
      }
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
          <p className="text-red-500">{t('buttons.run_your_linetrace')}</p>
        </>
      );
    } else if (linetraceTime === -1) {
      return (
        <>
          <p className="text-red-500">{t('buttons.dont_change_level', { level: levelID })}</p>
        </>
      );
    } else {
      return <p>{t(`messages.linetraceTime`, { time: Number(linetraceTime.toFixed(2)) })}</p>;
    }
  };

  const checkboxOnChange = (e: CheckboxChangeEvent) => {
    publish.current = e.target.checked;
  };

  return (
    <>
      <Modal
        title={t('buttons.submit_to_competition')}
        visible={isSubmitOpen}
        afterClose={abort}
        onOk={submit}
        okButtonProps={submitButtonProps}
        onCancel={abort}
        cancelText={t('samples.cancel')}
        okText={t('buttons.submit')}
      >
        <div className="p-2">
          <span className="text-sm">
            {t('buttons.competition')}: {name}
          </span>
        </div>
        <div className="p-2 pt-0">
          <span className="text-sm">
            {t('buttons.level')}: {level}
          </span>
        </div>
        <Input
          className="p-2"
          addonBefore={`${t('buttons.name')}: `}
          placeholder={`${t('buttons.enter_name')}`}
          value={competitorName}
          onChange={(e) => {
            setCompetitorName(e.target.value);
          }}
        />
        <div className="p-2 pt-0">
          <span className="text-sm">{t('buttons.no_inappropriate_terms')}</span>
        </div>
        <div className="p-2">
          <Checkbox onChange={checkboxOnChange} defaultChecked>
            <span className="text-black dark:text-gray-300">{t('publish_source_code_check')}</span>
          </Checkbox>
        </div>
        <div className="p-2">{renderSubmitError()}</div>
      </Modal>
      <EditorButton name={t('buttons.submit')} onClick={onClick} Icon={<VscArchive />} />
    </>
  );
};
