import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PurchaseManagement } from './PurchaseManagement';

const meta: Meta<typeof PurchaseManagement> = {
  title: 'Pages/PurchaseManagement',
  component: PurchaseManagement,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onEditPurchase: { action: 'edit purchase' },
    onDeletePurchase: { action: 'delete purchase' },
    onAddPurchase: { action: 'add purchase' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const generateMockPurchases = () => {
  const categories = [
    '食費',
    '交通費',
    '書籍',
    '家電',
    '衣類',
    '医療費',
    '娯楽',
  ];
  const purchases: any[] = [];

  // 過去6ヶ月のデータを生成
  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - monthOffset);

    // 各月に10-20件のデータ
    const itemCount = Math.floor(Math.random() * 11) + 10;

    for (let i = 0; i < itemCount; i++) {
      const date = new Date(baseDate);
      date.setDate(Math.floor(Math.random() * 28) + 1);

      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const amount = Math.floor(Math.random() * 50000) + 100;

      purchases.push({
        id: `${monthOffset}-${i}`,
        name: `${category}での購入 ${i + 1}`,
        amount,
        category,
        date,
        description:
          Math.random() > 0.5 ? `${category}関連の商品を購入` : undefined,
      });
    }
  }

  return purchases.sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const Default: Story = {
  args: {
    purchases: generateMockPurchases(),
  },
};

export const EmptyState: Story = {
  args: {
    purchases: [],
  },
};

export const SingleMonth: Story = {
  args: {
    purchases: [
      {
        id: '1',
        name: 'スーパーでの買い物',
        amount: 2500,
        category: '食費',
        date: new Date(),
        description: '野菜と肉を購入',
      },
      {
        id: '2',
        name: 'コンビニ',
        amount: 350,
        category: '食費',
        date: new Date(),
      },
      {
        id: '3',
        name: 'ガソリン代',
        amount: 4500,
        category: '交通費',
        date: new Date(),
        description: 'レギュラーガソリン満タン',
      },
    ],
  },
};
