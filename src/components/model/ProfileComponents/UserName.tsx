import { Button, Input, Skeleton } from 'antd';
import { message } from 'antd';
import { updateProfile } from 'firebase/auth';
import { useTranslation } from 'next-i18next';
import type { FC } from 'react';
import { useState } from 'react';
import { AiOutlineCheck, AiOutlineEdit } from 'react-icons/ai';

import { useAuthContext } from '@/components/model/Context/AuthContext';
import { auth } from '@/features/firebase';

export const UserName: FC = () => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [t] = useTranslation('profile');
  const { user } = useAuthContext();

  return (
    <>
      {user ? (
        <>
          <p className="mb-1 text-sm text-gray-500">{t('profile.displayName.label')}</p>
          <p>
            {isEditting ? (
              <Input.Search
                placeholder={t('profile.displayName.placeholder')}
                enterButton={isLoading || <AiOutlineCheck title={t('profile.displayName.submit')} />}
                allowClear
                loading={isLoading}
                defaultValue={user.displayName ?? undefined}
                onSearch={(value) => {
                  if (value.length === 0) {
                    setIsEditting(false);
                    return;
                  }

                  if (value.length > 32) {
                    message.error(t('profile.displayName.validation.max'));
                    setIsLoading(false);
                    return;
                  }

                  setIsLoading(true);
                  updateProfile(user, {
                    displayName: value,
                  })
                    .then(() => {
                      return auth.updateCurrentUser(user);
                    })
                    .then(() => {
                      setIsEditting(false);
                    })
                    .catch(() => {
                      setIsEditting(false);
                      message.error(t('profile.displayName.error'), 3);
                    });
                }}
              />
            ) : (
              <>
                <span className="text-lg text-gray-700">{user.displayName ?? t('profile.displayName.undefined')}</span>
                <Button
                  type="text"
                  icon={<AiOutlineEdit />}
                  title={t('profile.displayName.edit')}
                  onClick={() => {
                    setIsEditting(true);
                    setIsLoading(false);
                  }}
                />
              </>
            )}
          </p>
        </>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};
