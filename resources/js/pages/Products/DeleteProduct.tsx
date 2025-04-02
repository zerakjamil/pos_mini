import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';

interface ProductProps {
  product: {
    id: number;
    name: string;
  };
}

const DeleteProduct = ({ product }: ProductProps) => {
  const { t } = useTranslation();
  const direction = useLanguageDirection();
  const { delete: destroy, processing } = useForm();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    destroy(route('product.destroy', product.id), {
      preserveScroll: true,
      onFinish: () => setOpen(false),
    });
  };

  const rtlClass = direction === 'rtl' ? 'rtl' : '';

  return (
    <>
      <Button
        variant="ghost"
        className={`text-red-500 hover:text-red-700 hover:bg-red-50 ${rtlClass}`}
        onClick={() => setOpen(true)}
        disabled={processing}
      >
        <DeleteOutlined className={direction === 'rtl' ? 'ml-2' : 'mr-2'} />
        {t('common.delete')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={rtlClass} dir={'rtl'}>
          <DialogHeader>
            <DialogTitle>{t('products.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('products.deleteConfirmDescription', { name: product.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={`${rtlClass} flex-row-reverse`}>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteProduct;
