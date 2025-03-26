// types.ts
  import type { UploadFile } from 'antd/es/upload/interface';
  import type { Dayjs } from 'dayjs';

  export interface Category {
    id: number;
    name: string;
  }

  export interface ProductFormProps {
    categories: Category[];
    onSuccess?: () => void;
    editMode?: boolean;
    initialData?: ProductFormValues;
  }

  export interface ProductFormValues {
    name: string;
    barcode: string;
    price: number;
    batch_price: number;
    category_id: number;
    units_per_batch: number;
    stock: number;
    reorder_level: number;
    brand: string;
    expiration_date?: Dayjs | null;
    image?: UploadFile[];
    [key: string]: string | number | boolean | undefined | null | Dayjs | UploadFile[] | unknown;
  }

  export interface StepProps {
    data: ProductFormValues;
    setData: (key: keyof ProductFormValues, value: any) => void;
    errors: Record<string, string>;
    onNext?: () => void;
    onPrevious?: () => void;
    categories?: Category[];
    canProceed?: boolean;
    calculatedUnitPrice?: number | null;
    fileList?: UploadFile[];
    imagePreviewUrl?: string;
    isImageUploaded?: boolean;
    beforeUpload?: (file: any) => boolean;
    handleChange?: (info: any) => void;
    resetImage?: () => void;
    formErrors?: Record<string, string>;
    processing?: boolean;
    onSubmit?: (e: React.MouseEvent) => void;
    resetForm?: () => void;
    editMode?: boolean;
  }
