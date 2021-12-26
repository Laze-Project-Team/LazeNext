import { useTranslation } from 'next-i18next';
import type { FC, VFC } from 'react';
import { IconContext } from 'react-icons';
import { VscBook, VscHome } from 'react-icons/vsc';

import { StyledLink } from '@/components/ui/atoms/StyledLink';
import { EDITOR_VERSION } from '@/const/version';

const version = 'Laze Editor ' + EDITOR_VERSION;

type FooterNavigationProps = {
  href: string;
  title: string;
};

const FooterNavigation: FC<FooterNavigationProps> = ({ href, children, title }) => {
  return (
    <div className="hover:bg-white/5 px-2 transition-colors duration-200">
      <StyledLink href={href} className="h-full flex items-center text-gray-100 hover:text-gray-100" title={title}>
        <IconContext.Provider value={{ size: '1.3rem' }}>{children}</IconContext.Provider>
      </StyledLink>
    </div>
  );
};

export const EditorFooter: VFC = () => {
  const [t] = useTranslation(['editor']);

  return (
    <div className="h-6 flex bg-primary-400 dark:bg-primary-600 text-gray-100">
      <div className="px-4">{version}</div>
      <div className="px-4">{t('footer.acknowledgement')}</div>
      <div className="ml-auto flex">
        <FooterNavigation href="/" title={t('footer.home')}>
          <VscHome />
        </FooterNavigation>
        <FooterNavigation href="/docs" title={t('footer.docs')}>
          <VscBook />
        </FooterNavigation>
      </div>
    </div>
  );
};
