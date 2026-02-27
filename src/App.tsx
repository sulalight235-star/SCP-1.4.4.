/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  User, 
  Package, 
  Bell, 
  CheckSquare, 
  ChevronDown, 
  X, 
  Copy, 
  Send, 
  Upload, 
  FolderOpen,
  Search,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface Tab {
  id: string;
  label: string;
  active: boolean;
}

// --- Constants ---
const SIDEBAR_MENU: MenuItem[] = [
  { id: 'dashboard', label: '工作台', icon: <LayoutDashboard size={18} /> },
  { id: 'announcement', label: '咸亨公告', icon: <Megaphone size={18} /> },
  { id: 'basic-info', label: '基本信息', icon: <User size={18} />, children: [] },
  { 
    id: 'material-mgmt', 
    label: '物料管理', 
    icon: <Package size={18} />,
    children: [
      { id: 'project-submission', label: '项目物料提报管理' },
      { id: 'my-materials', label: '我的物料' },
      { id: 'add-material', label: '新增物料' },
      { id: 'batch-add', label: '批量新增' },
      { id: 'pending-submission', label: '待提交物料' },
      { id: 'my-brands', label: '我新增的品牌' },
      { id: 'my-applications', label: '我的申请' },
      { id: 'inventory-mgmt', label: '库存管理' },
    ]
  },
];

const INITIAL_TABS: Tab[] = [
  { id: 'tab1', label: '工作台', active: false },
  { id: 'tab2', label: '项目物料提报管理', active: false },
  { id: 'tab3', label: '我的物料', active: false },
  { id: 'tab4', label: '商品提报-详情', active: false },
  { id: 'tab5', label: '物料信息-编辑', active: true },
];

// --- Components ---

interface SidebarItemProps {
  item: MenuItem;
  depth?: number;
  key?: string | number;
}

const SidebarItem = ({ item, depth = 0 }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(item.id === 'material-mgmt');
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="w-full">
      <button
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-slate-100 ${
          depth === 0 ? 'font-medium text-slate-700' : 'text-slate-600 pl-12'
        }`}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          <span>{item.label}</span>
        </div>
        {hasChildren && (
          <ChevronDown 
            size={14} 
            className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} 
          />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/50"
          >
            {item.children?.map((child) => (
              <button
                key={child.id}
                className={`w-full text-left px-4 py-2.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors pl-14 ${
                  child.id === 'project-submission' ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' : ''
                }`}
              >
                {child.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FormField = ({ label, required, children, error, className = "" }: { label: string; required?: boolean; children: React.ReactNode; error?: string; className?: string }) => (
  <div className={`flex flex-col mb-4 ${className}`}>
    <div className="flex items-center gap-4">
      <label className="w-32 text-right text-sm text-slate-600 shrink-0">
        {required && <span className="text-red-500 mr-1">*</span>}
        {label}
      </label>
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
    {error && (
      <div className="ml-36 mt-1 text-[10px] text-red-500 animate-in fade-in slide-in-from-top-1">
        {error}
      </div>
    )}
  </div>
);

const Input = ({ placeholder, value, readOnly, className = "" }: { placeholder?: string; value?: string; readOnly?: boolean; className?: string }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    readOnly={readOnly}
    className={`w-full h-8 px-3 text-sm border border-slate-200 rounded bg-white focus:outline-none focus:border-blue-400 placeholder:text-slate-300 disabled:bg-slate-50 ${className}`}
  />
);

const Select = ({ placeholder, className = "" }: { placeholder?: string; className?: string }) => (
  <div className={`relative w-full h-8 ${className}`}>
    <select className="w-full h-full px-3 text-sm border border-slate-200 rounded bg-white appearance-none focus:outline-none focus:border-blue-400 text-slate-400">
      <option value="">{placeholder}</option>
    </select>
    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

const ValidatedInput = ({ 
  type = "text",
  placeholder, 
  value, 
  onChange,
  error,
  className = "" 
}: { 
  type?: string;
  placeholder?: string; 
  value: string; 
  onChange: (val: string) => void;
  error?: string;
  className?: string 
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full h-8 px-3 text-sm border rounded bg-white focus:outline-none transition-colors placeholder:text-slate-300 ${
      error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-400'
    } ${className}`}
  />
);

const MultiSelect = ({ 
  options, 
  selected, 
  onChange,
  placeholder = "请选择",
  error
}: { 
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter(s => s !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[32px] px-3 py-1 flex flex-wrap gap-1 items-center border rounded bg-white cursor-pointer transition-colors ${
          error ? 'border-red-500' : 'border-slate-200'
        }`}
      >
        {selected.length === 0 ? (
          <span className="text-sm text-slate-300">{placeholder}</span>
        ) : (
          selected.map(val => (
            <span key={val} className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
              {options.find(o => o.value === val)?.label}
              <X size={10} onClick={(e) => { e.stopPropagation(); toggleOption(val); }} />
            </span>
          ))
        )}
        <ChevronDown size={14} className="ml-auto text-slate-400" />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded shadow-lg max-h-48 overflow-y-auto">
          {options.map(opt => (
            <div 
              key={opt.value}
              onClick={() => toggleOption(opt.value)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                selected.includes(opt.value) ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
              }`}
            >
              {opt.label}
              {selected.includes(opt.value) && <CheckSquare size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [tabs, setTabs] = useState(INITIAL_TABS);

  // --- Form State ---
  const [form, setForm] = useState({
    numeric: '123',
    text: '123',
    amount: '123',
    date: '',
    selection: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (field: string, value: any) => {
    let error = "";
    switch (field) {
      case 'numeric': {
        const num = Number(value);
        const min = 10;
        const max = 1000;
        if (isNaN(num) || num <= min || num >= max) {
          error = `输入请符合大于${min}，小于${max}`;
        }
        break;
      }
      case 'text': {
        const minLen = 3;
        const maxLen = 20;
        const regex = /^[a-zA-Z0-9\u4e00-\u9fa5!@#$%^&*(),.?":{}|<>]+$/;
        if (!regex.test(value) || value.length < minLen || value.length > maxLen) {
          error = `请输入符合中文、英文、数字、符号；长度最小输入${minLen}个字符，最大输入${maxLen}个字符`;
        }
        break;
      }
      case 'amount': {
        const num = Number(value);
        const min = 0;
        const max = 1000000;
        const decimals = 2;
        const decimalRegex = new RegExp(`^\\d+(\\.\\d{1,${decimals}})?$`);
        if (isNaN(num) || num <= min || num >= max || !decimalRegex.test(value)) {
          error = `输入请符合大于${min}，小于${max}，支持保留${decimals}小数点`;
        }
        break;
      }
      case 'date': {
        // Simple validation for YYYY-MM-DD or YYYY-MM or YYYY
        const dateRegex = /^(\d{4})(-(\d{2}))?(-(\d{2}))?$/;
        const startDate = "2020-01-01";
        if (!dateRegex.test(value) || value < startDate) {
          error = `请输入年\\年月\\年月日，开始时间\\截止时间在${startDate}之后`;
        }
        break;
      }
      case 'selection': {
        if (value.length === 0) {
          error = "请选择单个/多个枚举值";
        }
        break;
      }
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleFieldChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-12 flex items-center px-4 bg-[#1e2a5e] text-white font-bold text-sm tracking-wide">
          威亨国际供应商协同平台 (SCP)
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {SIDEBAR_MENU.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-12 bg-[#1e2a5e] flex items-center justify-end px-4 gap-6 text-white text-xs">
          <button className="flex items-center gap-1 hover:opacity-80">
            <span>更新通知</span>
          </button>
          <button className="hover:opacity-80">
            <Bell size={16} />
          </button>
          <button className="hover:opacity-80">
            <CheckSquare size={16} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
            <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-[10px] font-bold">
              郑
            </div>
            <span>郑春林</span>
            <ChevronDown size={14} />
          </div>
        </header>

        {/* Tabs & Toolbar */}
        <div className="bg-white border-b border-slate-200 flex items-center justify-between px-2 h-9 shrink-0">
          <div className="flex items-center h-full">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 px-3 h-full text-xs cursor-pointer border-r border-slate-100 transition-colors ${
                  tab.active 
                    ? 'bg-blue-50 text-blue-600 border-t-2 border-t-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <X size={12} className="hover:text-red-500" />
              </div>
            ))}
          </div>
          <button className="px-4 h-7 text-xs bg-[#1e2a5e] text-white rounded hover:opacity-90">
            清除
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white m-4 rounded shadow-sm flex flex-col">
          {/* Top Info Bar */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="text-sm text-slate-500">
              项目报价员：<span className="text-slate-700">郭佳蕾-18767169579</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <Copy size={14} /> 复制
              </button>
              <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <Send size={14} /> 提交
              </button>
              <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <X size={14} /> 关闭
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-4 bg-blue-600 rounded-full" />
              <h2 className="font-bold text-sm">关联项目信息</h2>
              <span className="text-red-500 text-xs">* 请至少添加一个关联项目</span>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold mb-6 pl-4">中国节能</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">
                {/* Column 1 */}
                <div>
                  <FormField label="类目编码">
                    <Select placeholder="" />
                  </FormField>
                  <FormField label="第三方链接">
                    <Input placeholder="第三方链接" />
                  </FormField>
                  <FormField label="是否定制商品">
                    <Select placeholder="" />
                  </FormField>
                  <FormField label="属性值编码">
                    <div className="flex items-center gap-2">
                      <Input placeholder="属性值编码" className="bg-slate-50" />
                      <button className="text-xs text-blue-400 whitespace-nowrap">属性绑定</button>
                    </div>
                  </FormField>
                </div>

                {/* Column 2 */}
                <div>
                  <FormField label="商城价">
                    <Input placeholder="商城价" />
                  </FormField>
                  <FormField label="品牌编码">
                    <Input placeholder="品牌编码" />
                  </FormField>
                  <FormField label="商品唯一标识">
                    <Input placeholder="商品唯一标识" />
                  </FormField>
                </div>

                {/* Column 3 */}
                <div>
                  <FormField label="推送价">
                    <Input value="25596.00" />
                  </FormField>
                  <FormField label="商品寻源编号">
                    <Input placeholder="商品寻源编号" />
                  </FormField>
                  <FormField label="库存">
                    <Input placeholder="库存不填默认数量为:9999" />
                  </FormField>
                </div>
              </div>

              {/* New Fields Section */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">新增校验字段</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                  <FormField label="数字类" required error={errors.numeric}>
                    <ValidatedInput 
                      value={form.numeric} 
                      onChange={(v) => handleFieldChange('numeric', v)}
                      error={errors.numeric}
                      placeholder="请输入数字 (10-1000)"
                    />
                  </FormField>
                  <FormField label="文本类" required error={errors.text}>
                    <ValidatedInput 
                      value={form.text} 
                      onChange={(v) => handleFieldChange('text', v)}
                      error={errors.text}
                      placeholder="请输入文本 (3-20字符)"
                    />
                  </FormField>
                  <FormField label="金额类" required error={errors.amount}>
                    <ValidatedInput 
                      value={form.amount} 
                      onChange={(v) => handleFieldChange('amount', v)}
                      error={errors.amount}
                      placeholder="请输入金额 (0-1M, 2位小数)"
                    />
                  </FormField>
                  <FormField label="时间类" required error={errors.date}>
                    <ValidatedInput 
                      value={form.date} 
                      onChange={(v) => handleFieldChange('date', v)}
                      error={errors.date}
                      placeholder="YYYY-MM-DD (2020年后)"
                    />
                  </FormField>
                  <FormField label="单选/多选" required error={errors.selection} className="lg:col-span-2">
                    <MultiSelect 
                      options={[
                        { label: '选项 A', value: 'A' },
                        { label: '选项 B', value: 'B' },
                        { label: '选项 C', value: 'C' },
                        { label: '选项 D', value: 'D' },
                      ]}
                      selected={form.selection}
                      onChange={(v) => handleFieldChange('selection', v)}
                      error={errors.selection}
                      placeholder="请选择枚举值"
                    />
                  </FormField>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <label className="w-32 text-right text-sm text-slate-600 flex items-center justify-end gap-1">
                  <span className="cursor-help text-slate-400">?</span>
                  商品资质图片
                </label>
                <button className="flex items-center gap-2 px-4 h-8 border border-slate-200 rounded text-xs text-slate-400 hover:bg-slate-50">
                  <Upload size={14} /> 上传资质图片
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="mt-12 border border-slate-100 rounded overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_1fr] bg-blue-50/50 text-xs font-bold text-slate-700 h-10 items-center px-4">
                <div>图片资质类型</div>
                <div>图片</div>
                <div className="text-right">操作</div>
              </div>
              <div className="h-48 flex flex-col items-center justify-center text-slate-300 gap-2">
                <FolderOpen size={48} strokeWidth={1} />
                <span className="text-xs">暂无数据</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat/Support Icon (Bottom Right) */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden">
          <img 
            src="https://picsum.photos/seed/avatar/48/48" 
            alt="Support" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="w-10 h-10 rounded bg-white shadow-md border border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-50">
          <ChevronRight size={20} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}
