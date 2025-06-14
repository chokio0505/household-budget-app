'use client';

import React from 'react';
import { FilterOptions, PeriodType } from '../types/purchase';

interface PeriodFilterProps {
  currentFilter: FilterOptions;
  onFilterChange: (filter: FilterOptions) => void;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const handlePeriodChange = (period: PeriodType) => {
    onFilterChange({
      ...currentFilter,
      period,
    });
  };

  const handleDateChange = (year: number, month?: number) => {
    const date = month ? new Date(year, month - 1) : new Date(year, 0);
    onFilterChange({
      ...currentFilter,
      date,
    });
  };

  const getCurrentYear = () => currentFilter.date.getFullYear();
  const getCurrentMonth = () => currentFilter.date.getMonth() + 1;

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  };

  const monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        期間フィルター
      </h3>

      {/* 期間タイプ選択 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          表示期間
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handlePeriodChange('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter.period === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            月別
          </button>
          <button
            onClick={() => handlePeriodChange('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter.period === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            年別
          </button>
        </div>
      </div>

      {/* 年選択 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          年
        </label>
        <select
          value={getCurrentYear()}
          onChange={(e) =>
            handleDateChange(
              parseInt(e.target.value),
              currentFilter.period === 'month' ? getCurrentMonth() : undefined
            )
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {generateYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
      </div>

      {/* 月選択（月別表示の場合のみ） */}
      {currentFilter.period === 'month' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            月
          </label>
          <select
            value={getCurrentMonth()}
            onChange={(e) =>
              handleDateChange(getCurrentYear(), parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {monthNames.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 現在の選択表示 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <span className="font-medium">選択中: </span>
          {currentFilter.period === 'month'
            ? `${getCurrentYear()}年${getCurrentMonth()}月`
            : `${getCurrentYear()}年`}
        </p>
      </div>
    </div>
  );
};
