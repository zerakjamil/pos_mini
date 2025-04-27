import React from 'react';
import { Breadcrumb, Space, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const { Title } = Typography;

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbItems?: BreadcrumbItem[];
    className?: string;
    actions?: React.ReactNode;
}

export function PageHeader({
    title,
    description,
    breadcrumbItems = [],
    className,
    actions
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col space-y-4", className)}>
            {breadcrumbItems.length > 0 && (
                <Breadcrumb>
                    {breadcrumbItems.map((item, index) => (
                        <Breadcrumb.Item key={index}>
                            {index === 0 ? (
                                <Link href={item.href}>
                                    <HomeOutlined /> {item.title}
                                </Link>
                            ) : (
                                <Link href={item.href}>{item.title}</Link>
                            )}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            )}
            
            <div className="flex items-center justify-between">
                <div>
                    <Title level={2} className="!m-0">{title}</Title>
                    {description && (
                        <Typography.Text type="secondary" className="mt-1">
                            {description}
                        </Typography.Text>
                    )}
                </div>
                {actions && <Space>{actions}</Space>}
            </div>
        </div>
    );
}
