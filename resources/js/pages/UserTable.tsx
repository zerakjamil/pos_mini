import React from 'react';
import {Table, Tag, Space} from 'antd';
import type {TableProps} from 'antd';

interface DataType{
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

interface UserTableProps {
    users: DataType[];
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Age",
        dataIndex: "age",
        key: "age",
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
    },
    {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        render: (_,{tags})=>(
            <>
                {tags.map((tag)=>(
                    <Tag color="blue" key={tag}>
                        {tag}
                    </Tag>
                ))}
            </>
        ),
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => (
            <Space size="middle">
                <a>Edit {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
    ];

const UserTable: React.FC<UserTableProps> = ({users} ) => {
    return <Table<DataType> columns={columns} dataSource={users} />
};

export default UserTable;
