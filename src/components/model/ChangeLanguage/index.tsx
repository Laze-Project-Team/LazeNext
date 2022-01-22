import { Button, Dropdown, Menu } from 'antd';
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
    <Menu className="!bg-white/80">
      {Object.keys(i18nLangList).map((key) => {
        return (
          <Menu.Item key={key} className="!bg-transparent" disabled={locale === key}>
            <Link href={pathname} locale={key}>
              <a className={cx('text-gray-400 hover:text-gray-300', locale === key && 'text-primary-default')}>
                {i18nLangList[key]}
              </a>
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export const ChangeLanguage: FC = () => {
  const [t] = useTranslation(['layout']);

  return (
    <>
      <Dropdown overlay={<LanguageMenu />} trigger={['click']}>
        <Button
          type="text"
          onClick={(e) => {
            return e.preventDefault();
          }}
          className="inline-flex items-center !text-gray-400 hover:!text-gray-200 hover:!bg-white/5"
        >
          <IoLanguageOutline className="inline text-xl" />
          <span className="">{t('changeLanguage')}</span>
        </Button>
      </Dropdown>
    </>
  );
};
