import { Avatar, Button, message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useState } from 'react';
import { AiOutlineCloudUpload, AiOutlineLoading } from 'react-icons/ai';

import { useMediaQuery } from '@/components/functional/useMediaQuery';
import { useAuthContext } from '@/components/model/Context/AuthContext';
import { UserAvatarIcon } from '@/components/model/Profiles/UserAvatarIcon';
import { Spin } from '@/components/ui/Spin';
import { storage } from '@/features/firebase';
import { cx } from '@/features/utils/cx';

const QUERY_XS_UP = '(min-width: 480px)';
const QUERY_XS_DOWN = '(max-width: 479px)';

export const UserAvatar: VFC = () => {
  const { user } = useAuthContext();
  const [t] = useTranslation('profile');
  const media = useMediaQuery([QUERY_XS_UP, QUERY_XS_DOWN]);

  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <>
      <div className="relative !h-[max(20vw,4rem)] max-h-[12rem] !w-[max(20vw,4rem)] max-w-[12rem]">
        <Avatar
          className="!h-[max(20vw,4rem)] max-h-[12rem] !w-[max(20vw,4rem)] max-w-[12rem]"
          icon={<UserAvatarIcon />}
        />
        <ImgCrop
          rotate
          beforeCrop={(file) => {
            const isImage = ['image/png', 'image/jpeg'].includes(file.type);
            if (!isImage) {
              message.error(t('profile.avatar.edit.invalid'));
            }
            return isImage;
          }}
        >
          <Upload
            showUploadList={false}
            customRequest={(option) => {
              if (user) {
                if (typeof option.file !== 'string') {
                  const imageRef = ref(storage, `${user.uid}/avatar`);
                  setIsUpdating(true);
                  uploadBytes(imageRef, option.file)
                    .then(() => {
                      return getDownloadURL(imageRef);
                    })
                    .then((url) => {
                      return updateProfile(user, {
                        photoURL: url,
                      });
                    })
                    .then(() => {
                      message.success(t('profile.avatar.edit.success'));
                      setIsUpdating(false);
                    })
                    .catch(() => {
                      message.error(t('profile.avatar.edit.error'));
                      setIsUpdating(false);
                    });
                }
              }
            }}
            disabled={isUpdating}
          >
            <Button
              className={cx(
                '!absolute top-[85%] left-[85%] translate-x-[-50%] translate-y-[-50%]  !p-[0.1rem]  ',
                isUpdating && '!border-[hsl(199,100%,55%)] !text-[hsl(199,100%,55%)]'
              )}
              disabled={isUpdating}
              shape="circle"
              title={t('profile.avatar.edit')}
              icon={
                isUpdating ? (
                  <Spin className="h-full w-full p-[0.15rem]">
                    <AiOutlineLoading className="h-full w-full" />
                  </Spin>
                ) : (
                  <AiOutlineCloudUpload className="h-full w-full" />
                )
              }
              size={media === QUERY_XS_DOWN ? 'small' : 'middle'}
            />
          </Upload>
        </ImgCrop>
      </div>
    </>
  );
};
