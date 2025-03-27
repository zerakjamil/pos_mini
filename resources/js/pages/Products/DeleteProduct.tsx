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

interface ProductProps {
  product: {
    id: number;
    name: string;
  };
}

const DeleteProduct = ({ product }: ProductProps) => {
  const { delete: destroy, processing } = useForm();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    destroy(route('product.destroy', product.id), {
      preserveScroll: true,
      onFinish: () => setOpen(false),
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => setOpen(true)}
        disabled={processing}
      >
        <DeleteOutlined className="mr-2" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {product.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteProduct;
