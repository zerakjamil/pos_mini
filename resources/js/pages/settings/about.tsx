import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Github, Download, Phone, GlobeIcon } from 'lucide-react';
import { ViberIcon, TelegramIcon, WhatsAppIcon } from '@/components/icons/social';
import { useToast } from '@/components/ui/use-toast';
import { Copy } from 'lucide-react';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface DeveloperProfile {
    name: string;
    role: string;
    avatar: string;
    bio: string;
    skills: string[];
    github: string;
    cvUrl?: string;
    website?: string;
    contact: {
        phone: string;
        viber: string;
        telegram: string;
        whatsapp: string;
    };
}

export default function About() {
    const { t } = useTranslation('settings/about');
    const isRTL = t('direction', { defaultValue: 'ltr' }) === 'rtl';
    const { toast } = useToast();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb', 'About'),
            href: '/settings/about',
        },
    ];

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: t('copy.success', 'کۆپی کرا!'),
                description: null,
                duration: 3000,
                className: isRTL ? 'rtl' : 'ltr',
            });
        }).catch(() => {
            toast({
                title: t('copy.error', 'هەڵە ڕوویدا!'),
                description: t('copy.try_again', 'تکایە دووبارە هەوڵبدەرەوە'),
                variant: "destructive",
                duration: 3000,
                className: isRTL ? 'rtl' : 'ltr',
            });
        });
    };

    const developers: DeveloperProfile[] = [
        {
            name: t('developers.zerak.name'),
            role: t('developers.zerak.role'),
            avatar: '/images/devs/zerak.jpg',
            bio: t('developers.zerak.bio'),
            skills: ['React', 'TypeScript', 'PHP', 'Laravel', 'MySQL', 'AWS', 'React Native'],
            github: 'https://github.com/zerakjamil',
            cvUrl: '/downloads/cv/zerak-jamil-cv.pdf',
            contact: {
                phone: '+96407810270247',
                viber: 'https://chats.viber.com/+9647810270247',
                telegram: 'https://t.me/zerakjamil',
                whatsapp: 'https://wa.me/7810270247',
            },
        },
        {
            name: t('developers.abdulrahman.name'),
            role: t('developers.abdulrahman.role'),
            avatar: '/images/devs/abdulrahman.jpg',
            bio: t('developers.abdulrahman.bio'),
            skills: ['Computer Engineering', 'IS System', 'IT Manager', 'PHP', 'MySQL'],
            github: 'https://github.com/ce-abdulrahman',
            website: 'https://ce-abdulrahman.github.io/personal/#home',
            contact: {
                phone: '+9647504342452',
                viber: 'https://chats.viber.com/+9647504342452',
                telegram: 'https://t.me/Agha_ACE',
                whatsapp: 'https://wa.me/7504342452',
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('page_title', 'About Us')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('heading.title', 'About Our Team')}
                        description={t('heading.description', 'Meet the developers behind this application')}
                    />

                    <Tabs defaultValue="team" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="team">{t('tabs.team', 'Our Team')}</TabsTrigger>
                            <TabsTrigger value="mission">{t('tabs.mission', 'Our Mission')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="team" className="space-y-6 pt-4">
                            {developers.map((developer, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16 border">
                                                <AvatarImage src={developer.avatar} alt={developer.name} />
                                                <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle>{developer.name}</CardTitle>
                                                <CardDescription>{developer.role}</CardDescription>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {developer.github && <Button variant="outline" size="sm" asChild>
                                                <a href={developer.github} target="_blank" rel="noopener noreferrer">
                                                    <Github className="mr-2 h-4 w-4" />
                                                    {t('buttons.github')}
                                                </a>
                                            </Button>}
                                            {developer.cvUrl && <Button variant="outline" size="sm" asChild>
                                                <a href={developer.cvUrl} download>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    {t('buttons.download_cv')}
                                                </a>
                                            </Button>}
                                            {developer.website && <Button variant="outline" size="sm" asChild>
                                                <a href={developer.website} download>
                                                    <GlobeIcon className="mr-2 h-4 w-4" />
                                                    {t('buttons.website')}
                                                </a>
                                            </Button>}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pb-2">
                                        <p className="text-muted-foreground mb-4">{developer.bio}</p>

                                        <div className="mb-4">
                                            <div className="text-sm font-medium mb-2">{t('skills', 'Skills')}:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {developer.skills.map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary">{skill}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator className="my-4" />

                                        <div>
                                            <div className="text-sm font-medium mb-2">{t('contact', 'Contact')}:</div>
                                            <div className="flex flex-wrap gap-3">
                                                    <div className="flex flex-wrap gap-3">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => copyToClipboard(developer.contact.phone, t('buttons.phone'))}
                                                            className="bg-gray-600 hover:bg-gray-700 text-white"
                                                        >
                                                            <Phone className="mr-2 h-4 w-4" />
                                                            <span className="mr-2">{t('buttons.phone')}</span>
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            asChild
                                                            className="bg-[#7360F2] hover:bg-[#7360F2]/90 text-white"
                                                        >
                                                            <a href={developer.contact.viber}>
                                                                <ViberIcon className="mr-2 h-4 w-4" />
                                                                {t('buttons.viber')}
                                                            </a>
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            asChild
                                                            className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white"
                                                        >
                                                            <a href={developer.contact.telegram} target="_blank" rel="noopener noreferrer">
                                                                <TelegramIcon className="mr-2 h-4 w-4" />
                                                                {t('buttons.telegram')}
                                                            </a>
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            asChild
                                                            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                                                        >
                                                            <a href={developer.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                                                                <WhatsAppIcon className="mr-2 h-4 w-4" />
                                                                {t('buttons.whatsapp')}
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="mission" className="space-y-4 pt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('mission.title', 'Our Mission')}</CardTitle>
                                    <CardDescription>
                                        {t('mission.subtitle', 'What drives our development philosophy')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p>
                                        {t('mission.description1', 'We are committed to creating software solutions that are not only functional but also intuitive and delightful to use. Our team focuses on clean, maintainable code and responsive designs that work across all devices.')}
                                    </p>
                                    <p>
                                        {t('mission.description2', 'With a combined experience of over a decade in web development, we bring expertise in modern frontend frameworks, backend systems, and DevOps practices to deliver robust applications that scale.')}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-sm text-muted-foreground">
                                        {t('mission.footer', "Founded in 2021, we've been helping businesses transform their ideas into reality.")}
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
