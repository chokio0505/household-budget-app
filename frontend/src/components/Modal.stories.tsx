"use client";

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onClose: { action: 'modal closed' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'モーダルタイトル',
    children: 'これはモーダルの内容です。',
  },
};

export const LargeSize: Story = {
  args: {
    isOpen: true,
    title: '大きなモーダル',
    size: 'xl',
    children: 'これは大きなサイズのモーダルです。',
  },
};

export const SmallSize: Story = {
  args: {
    isOpen: true,
    title: '小さなモーダル',
    size: 'sm',
    children: 'これは小さなサイズのモーダルです。',
  },
};

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    children: 'タイトルなしのモーダルです。',
  },
};
