import { Skeleton } from 'antd';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import Jdenticon from 'react-jdenticon';

import { useAuthContext } from '@/components/model/Context/AuthContext';

export const UserAvatar: VFC = () => {
  const [t] = useTranslation('profile');
  const { user } = useAuthContext();

  return (
    <div className="h-full w-full rounded-[50%] border-2 border-gray-400 p-[1px]">
      {user ? (
        user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={t('profile.avatar')}
            className="h-full w-full select-none rounded-[50%] bg-white"
          />
        ) : (
          <div className="rounded-[50%]">
            <Jdenticon value={user.uid} size="100%" />
          </div>
        )
      ) : (
        <Skeleton.Avatar className="h-full !w-full" shape="circle" active />
      )}
    </div>
  );
};
