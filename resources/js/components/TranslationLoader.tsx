import { useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next
import { Spin } from 'antd';

interface TranslationLoaderProps {
  children: ReactNode;
}

const TranslationLoader = ({ children }: TranslationLoaderProps) => {
  const { i18n } = useTranslation();
  const [translationsReady, setTranslationsReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (i18n.isInitialized) {
      setTranslationsReady(true);
    } else {
      const handleInitialized = () => {
        setTranslationsReady(true);
      };

      i18n.on('initialized', handleInitialized);
      return () => {
        i18n.off('initialized', handleInitialized);
      };
    }
  }, [i18n]);

  if (!translationsReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

export default TranslationLoader;
