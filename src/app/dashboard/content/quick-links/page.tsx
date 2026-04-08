'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  getQuickLinks,
  getQuickLinkCategories
} from '@/actions/common/cms-actions';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { QuickLinksTable } from './_components/quick-links-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesTable } from '../quick-link-categories/_components/categories-table';
import { AddQuickLinkButton } from './_components/add-link-button';
import { AddCategoryButton } from '../quick-link-categories/_components/add-category-button';
import { useSearchParams } from 'next/navigation';

export default function QuickLinksPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const [tab, setTab] = useState('links');
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
    if (newTab === 'links') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', newTab);
    }
    window.history.pushState({}, '', url.toString());
  };

  if (!mounted) {
    return (
      <PageContainer
        pageTitle="Quick Links"
        pageDescription="Manage sidebar links, downloads, and external resources — and their categories."
      >
        <div className="space-y-2">
          <div className="flex space-x-1 rounded-lg border p-1">
            <div className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium">
              Quick Links
            </div>
            <div className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium">
              Link Categories
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle="Quick Links"
      pageDescription="Manage sidebar links, downloads, and external resources — and their categories."
    >
      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-2">
        <TabsList>
          <TabsTrigger value="links">Quick Links</TabsTrigger>
          <TabsTrigger value="categories">Link Categories</TabsTrigger>
        </TabsList>

        {/* ── Quick Links tab ── */}
        <TabsContent value="links" className="space-y-2">
          <QuickLinksDataWrapper addButton={<AddQuickLinkButton />} />
        </TabsContent>

        {/* ── Categories tab ── */}
        <TabsContent value="categories" className="space-y-2">
          <QLCategoriesDataWrapper addButton={<AddCategoryButton />} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

function QuickLinksDataWrapper({ addButton }: { addButton?: React.ReactNode }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getQuickLinks();
      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch quick links');
      }
    } catch (err) {
      setError('Failed to fetch quick links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleQuickLinksChange = () => {
      fetchData();
    };

    window.addEventListener('quickLinksChanged', handleQuickLinksChange);
    return () => {
      window.removeEventListener('quickLinksChanged', handleQuickLinksChange);
    };
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

  return <QuickLinksTable data={data} addButton={addButton} />;
}

function QLCategoriesDataWrapper({
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
      const result = await getQuickLinkCategories();
      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('Failed to fetch categories');
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

    window.addEventListener('categoriesChanged', handleCategoriesChange);
    return () => {
      window.removeEventListener('categoriesChanged', handleCategoriesChange);
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

  return <CategoriesTable data={data} addButton={addButton} />;
}
