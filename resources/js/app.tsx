import '../css/app.css';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import TranslationLoader from './components/TranslationLoader';
import { RtlProvider } from '@/contexts/RtlContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://192.168.101.143:5173';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <RtlProvider>
                <TranslationLoader>
                    <App {...props} />
                </TranslationLoader>
            </RtlProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
