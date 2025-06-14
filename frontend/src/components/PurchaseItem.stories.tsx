import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PurchaseItem } from './PurchaseItem';

const meta: Meta<typeof PurchaseItem> = {
  title: 'Components/PurchaseItem',
  component: PurchaseItem,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onEdit: { action: 'edited' },
    onDelete: { action: 'deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    purchase: {
      id: '1',
      name: 'スーパーでの買い物',
      amount: 2500,
      category: '食費',
      date: new Date('2024-06-14'),
      description: '野菜と肉を購入',
    },
  },
};

export const WithoutDescription: Story = {
  args: {
    purchase: {
      id: '2',
      name: 'コンビニ',
      amount: 350,
      category: '食費',
      date: new Date('2024-06-13'),
    },
  },
};

export const HighAmount: Story = {
  args: {
    purchase: {
      id: '3',
      name: '家電購入',
      amount: 85000,
      category: '家電',
      date: new Date('2024-06-10'),
      description: '新しい冷蔵庫を購入しました',
    },
  },
};

export const WithoutActions: Story = {
  args: {
    purchase: {
      id: '4',
      name: 'ガソリン代',
      amount: 4500,
      category: '交通費',
      date: new Date('2024-06-12'),
    },
    onEdit: undefined,
    onDelete: undefined,
  },
};
