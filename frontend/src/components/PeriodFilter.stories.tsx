"use client";

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PeriodFilter } from './PeriodFilter';

const meta: Meta<typeof PeriodFilter> = {
  title: 'Components/PeriodFilter',
  component: PeriodFilter,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onFilterChange: { action: 'filter changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthlyFilter: Story = {
  args: {
    currentFilter: {
      period: 'month',
      date: new Date(2024, 5), // 2024年6月
    },
  },
};

export const YearlyFilter: Story = {
  args: {
    currentFilter: {
      period: 'year',
      date: new Date(2024, 0), // 2024年
    },
  },
};

export const CurrentMonth: Story = {
  args: {
    currentFilter: {
      period: 'month',
      date: new Date(), // 現在の月
    },
  },
};
