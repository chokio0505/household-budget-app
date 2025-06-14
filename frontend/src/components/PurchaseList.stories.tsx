"use client";

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PurchaseList } from './PurchaseList';

const meta: Meta<typeof PurchaseList> = {
  title: 'Components/PurchaseList',
  component: PurchaseList,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onEditPurchase: { action: 'edit purchase' },
    onDeletePurchase: { action: 'delete purchase' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const samplePurchases = [
  {
    id: '1',
    name: 'スーパーでの買い物',
    amount: 2500,
    category: '食費',
    date: new Date('2024-06-14'),
    description: '野菜と肉を購入',
  },
  {
    id: '2',
    name: 'コンビニ',
    amount: 350,
    category: '食費',
    date: new Date('2024-06-13'),
  },
  {
    id: '3',
    name: 'ガソリン代',
    amount: 4500,
    category: '交通費',
    date: new Date('2024-06-12'),
    description: 'レギュラーガソリン満タン',
  },
  {
    id: '4',
    name: '本購入',
    amount: 1800,
    category: '書籍',
    date: new Date('2024-06-11'),
    description: 'プログラミング関連書籍',
  },
];

const sampleSummary = {
  totalAmount: 9150,
  itemCount: 4,
  categoryBreakdown: {
    食費: 2850,
    交通費: 4500,
    書籍: 1800,
  },
};

export const Default: Story = {
  args: {
    purchases: samplePurchases,
    summary: sampleSummary,
  },
};

export const Empty: Story = {
  args: {
    purchases: [],
    summary: {
      totalAmount: 0,
      itemCount: 0,
      categoryBreakdown: {},
    },
  },
};

export const Loading: Story = {
  args: {
    purchases: [],
    summary: {
      totalAmount: 0,
      itemCount: 0,
      categoryBreakdown: {},
    },
    loading: true,
  },
};

export const SingleItem: Story = {
  args: {
    purchases: [samplePurchases[0]],
    summary: {
      totalAmount: 2500,
      itemCount: 1,
      categoryBreakdown: {
        食費: 2500,
      },
    },
  },
};
