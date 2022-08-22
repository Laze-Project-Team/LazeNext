import { Button, message, Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useTranslation } from 'next-i18next';
import type { FC } from 'react';
import { useEffect } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';

type props = {
  addCustomLanguage: (id: string, name: string) => void;
};

export const UploadNewLanguage: FC<props> = ({ addCustomLanguage }) => {
  const [t] = useTranslation('editor');

  useEffect(() => {
    const storage = localStorage.getItem('custom_lang');
    if (storage) {
      const langs: Record<string, { name: string; content: string }> = JSON.parse(storage);
      Object.keys(langs).forEach((key) => {
        addCustomLanguage(key, langs[key].name);
      });
    }
  }, [addCustomLanguage]);

  return (
    <>
      <Upload
        beforeUpload={(file) => {
          const isJSON = file.type === 'application/json';
          if (!isJSON) {
            message.error(t('convert.upload.error_validation', { file: file.name }));
          }
          return true;
        }}
        customRequest={({ file }) => {
          if (typeof file === 'string') return;

          const filename = (file as RcFile).name;

          file
            .text()
            .then((text) => {
              const content = JSON.parse(text);
              const id = `custom-${Date.now()}`;
              const name = content.config.name as string;

              const storage = localStorage.getItem('custom_lang');
              const lang = {
                [id]: { name, content },
              };

              addCustomLanguage(id, name);

              if (storage !== null) {
                localStorage.setItem('custom_lang', JSON.stringify({ ...JSON.parse(storage), ...lang }));
              } else {
                localStorage.setItem('custom_lang', JSON.stringify(lang));
              }
            })
            .catch(() => {
              message.error(t('convert.upload.error_upload', { file: filename as string }));
            });
        }}
        showUploadList={false}
      >
        <Button
          type="dashed"
          className="dark:border-gray-[#ddd] dark:!bg-transparent dark:text-[#ddd] dark:hover:border-primary-100 dark:hover:text-primary-100"
          icon={<AiOutlineUpload className="inline" />}
        >
          {t('convert.upload.title')}
        </Button>
      </Upload>
    </>
  );
};
