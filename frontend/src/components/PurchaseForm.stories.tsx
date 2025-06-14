import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PurchaseForm } from './PurchaseForm';

const meta = {
  title: 'Components/PurchaseForm',
  component: PurchaseForm,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onSubmit: { action: 'form submitted' },
    onCancel: { action: 'form cancelled' },
  },
} satisfies Meta<typeof PurchaseForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddNew: Story = {
  args: {},
};

export const EditExisting: Story = {
  args: {
    initialData: {
      id: '1',
      name: 'スーパーでの買い物',
      amount: 2500,
      category: '食費',
      date: new Date('2024-06-14'),
      description: '野菜と肉を購入',
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const WithoutCancel: Story = {
  args: {
    onCancel: undefined,
  },
};
