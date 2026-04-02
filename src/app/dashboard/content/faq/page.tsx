'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { getFaqs, getFaqCategories } from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { FaqsTable } from './_components/faqs-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaqCategoriesTable } from './_components/faq-categories-table';
import { AddFaqButton } from './_components/add-faq-button';
import { AddFaqCategoryButton } from './_components/add-faq-category-button';
import { useSearchParams } from 'next/navigation';

export default function FaqPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const [tab, setTab] = useState('faqs');
  const [mounted, setMounted] = useState(false);
  const searchParamsFromHook = useSearchParams();

  useEffect(() => {
    setMounted(true);
    // Get tab from URL search params
    const currentTab = searchParamsFromHook.get('tab');
    if (currentTab === 'categories') {
      setTab('categories');
    }
  }, [searchParamsFromHook]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    // Update URL without full refresh
    const url = new URL(window.location.href);
    if (newTab === 'faqs') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', newTab);
    }
    window.history.pushState({}, '', url.toString());
  };

  if (!mounted) {
    return (
      <PageContainer
        pageTitle="FAQ"
        pageDescription="Manage frequently asked questions and their categories."
      >
        <div className="space-y-2">
          <div className="flex space-x-1 rounded-lg border p-1">
            <div className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium">
              FAQs
            </div>
            <div className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium">
              FAQ Categories
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle="FAQ"
      pageDescription="Manage frequently asked questions and their categories."
    >
      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-2">
        <TabsList>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="categories">FAQ Categories</TabsTrigger>
        </TabsList>

        {/* ── FAQs tab ── */}
        <TabsContent value="faqs" className="space-y-2">
          <FaqsDataWrapper addButton={<AddFaqButton />} />
        </TabsContent>

        {/* ── Categories tab ── */}
        <TabsContent value="categories" className="space-y-2">
          <FaqCategoriesDataWrapper addButton={<AddFaqCategoryButton />} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

function FaqsDataWrapper({ addButton }: { addButton?: React.ReactNode }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getFaqs();
      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch FAQs');
      }
    } catch (err) {
      setError('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <DataTableSkeleton columnCount={6} rowCount={10} />;
  }

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return <FaqsTable data={data} addButton={addButton} />;
}

function FaqCategoriesDataWrapper({
  addButton
}: {
  addButton?: React.ReactNode;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getFaqCategories();
      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch FAQ categories');
      }
    } catch (err) {
      setError('Failed to fetch FAQ categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleCategoriesChange = () => {
      fetchData();
    };

    window.addEventListener('faqCategoriesChanged', handleCategoriesChange);
    return () => {
      window.removeEventListener(
        'faqCategoriesChanged',
        handleCategoriesChange
      );
    };
  }, []);

  if (loading) {
    return <DataTableSkeleton columnCount={6} rowCount={6} />;
  }

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return <FaqCategoriesTable data={data} addButton={addButton} />;
}
