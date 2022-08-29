import { Button, Dropdown } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { FC, VFC } from 'react';
import { IoLanguageOutline } from 'react-icons/io5';

import { i18nLangList } from '@/const/lang';
import { cx } from '@/features/utils/cx';

const LanguageMenu: VFC = () => {
  const { pathname, locale } = useRouter();
  return (
    <ul className="bg-white/80 py-2">
      {Object.keys(i18nLangList).map((key) => {
        return (
          <li key={key} className="!bg-transparent px-4 py-2">
            {locale === key ? (
              <button className="text-gray-300" disabled>
                {i18nLangList[key]}
              </button>
            ) : (
              <Link href={pathname} locale={key}>
                <a className="inline-block w-full text-gray-700 hover:text-primary-100">{i18nLangList[key]}</a>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

type ChangeLanguageProps = {
  isText: boolean;
};

export const ChangeLanguage: FC<ChangeLanguageProps> = ({ isText }) => {
  const [t] = useTranslation(['layout']);

  return (
    <>
      <Dropdown overlay={<LanguageMenu />} trigger={['click']}>
        <Button
          type="text"
          onClick={(e) => {
            return e.preventDefault();
          }}
          className={cx(
            'inline-flex items-center !text-gray-400 hover:!bg-white/5 hover:!text-gray-200',
            isText || 'h-8 w-8 justify-center !p-1'
          )}
          title={isText ? undefined : t('changeLanguage')}
        >
          <IoLanguageOutline className="inline text-xl" />
          {isText && <span className="">{t('changeLanguage')}</span>}
        </Button>
      </Dropdown>
    </>
  );
};
