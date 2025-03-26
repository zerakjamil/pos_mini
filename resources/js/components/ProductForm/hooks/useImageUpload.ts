// hooks/useImageUpload.ts
import { useState } from 'react';
import { message } from 'antd';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

export const useImageUpload = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>(undefined);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }

    setIsImageUploaded(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    return false;
  };

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const resetImage = () => {
    setFileList([]);
    setImagePreviewUrl(undefined);
    setIsImageUploaded(false);
  };

  return {
    fileList,
    imagePreviewUrl,
    isImageUploaded,
    beforeUpload,
    handleChange,
    resetImage
  };
};
