import Link from 'next/link';
import {
  IconBell,
  IconFileText,
  IconPhoto,
  IconNavigationFilled,
  IconLink,
  IconFolderOpen,
  IconArrowRight
} from '@tabler/icons-react';
import PageContainer from '@/components/layout/page-container';
import {
  getAnnouncements,
  getCmsPages,
  getMediaItems,
  getNavigationItems,
  getQuickLinks
} from '@/actions/common/cms-actions';

export const metadata = {
  title: 'Dashboard: Content Management'
};

async function getStats() {
  const [announcements, pages, media, navigation, quickLinks] =
    await Promise.allSettled([
      getAnnouncements(),
      getCmsPages(),
      getMediaItems(),
      getNavigationItems(),
      getQuickLinks()
    ]);

  return {
    announcements:
      announcements.status === 'fulfilled' && announcements.value.success
        ? (announcements.value.data?.length ?? 0)
        : 0,
    pages:
      pages.status === 'fulfilled' && pages.value.success
        ? (pages.value.data?.length ?? 0)
        : 0,
    media:
      media.status === 'fulfilled' && media.value.success
        ? (media.value.data?.length ?? 0)
        : 0,
    navigation:
      navigation.status === 'fulfilled' && navigation.value.success
        ? (navigation.value.data?.length ?? 0)
        : 0,
    quickLinks:
      quickLinks.status === 'fulfilled' && quickLinks.value.success
        ? (quickLinks.value.data?.length ?? 0)
        : 0
  };
}

const sections = [
  {
    title: 'Public Notices',
    description:
      'Create and manage announcements & official updates shown on the portal homepage.',
    href: '/dashboard/content/announcements',
    icon: IconBell,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    statKey: 'announcements' as const,
    tip: 'Notice Categories are managed inside this page as a tab.'
  },
  {
    title: 'Content Pages',
    description:
      'Write and publish static pages (About Us, Privacy Policy, etc.) with a rich text editor.',
    href: '/dashboard/content/pages',
    icon: IconFileText,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200 dark:border-violet-800',
    statKey: 'pages' as const,
    tip: 'Pages link to a Navigation item to appear as dropdown sub-pages.'
  },
  {
    title: 'Media Library',
    description:
      'Upload and organise images, PDFs, and documents used across all content.',
    href: '/dashboard/content/media',
    icon: IconPhoto,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    statKey: 'media' as const,
    tip: 'Upload images here first, then attach them to notices or pages.'
  },
  {
    title: 'Navigation',
    description:
      'Manage the main header menu. Add nav items, sub-links, and content under each.',
    href: '/dashboard/content/navigation',
    icon: IconNavigationFilled,
    color: 'text-teal-600',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    border: 'border-teal-200 dark:border-teal-800',
    statKey: 'navigation' as const,
    tip: 'Step: Nav Item → Sub-Links → Content Pages.'
  },
  {
    title: 'Quick Links',
    description:
      'Manage sidebar resource links, downloads, and external links shown on the portal.',
    href: '/dashboard/content/quick-links',
    icon: IconLink,
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    statKey: 'quickLinks' as const,
    tip: 'Quick Link Categories are managed inside this page as a tab.'
  }
];

const workflowSteps = [
  {
    step: 1,
    title: 'Upload Media',
    desc: 'Go to Media Library and upload images/PDFs you plan to use in notices or pages.',
    href: '/dashboard/content/media',
    icon: IconPhoto,
    color:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
  },
  {
    step: 2,
    title: 'Set Up Navigation',
    desc: 'Create a Navigation item (e.g. "About Us"), then add Sub-Links under it.',
    href: '/dashboard/content/navigation',
    icon: IconNavigationFilled,
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400'
  },
  {
    step: 3,
    title: 'Create Content Pages',
    desc: 'Write page content and link each page to the Nav sub-link created above.',
    href: '/dashboard/content/pages',
    icon: IconFileText,
    color:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400'
  },
  {
    step: 4,
    title: 'Publish Notices',
    desc: 'Add a Notice Category first, then create your public notice and set it active.',
    href: '/dashboard/content/announcements',
    icon: IconBell,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
  }
];

export default async function ContentHubPage() {
  const stats = await getStats();

  return (
    <PageContainer
      pageTitle="Content Management"
      pageDescription="Manage all public-facing content for the Census Portal from one place."
    >
      {/* ── Recommended Workflow ── */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Recommended Workflow
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map(
            ({ step, title, desc, href, icon: Icon, color }) => (
              <Link
                key={step}
                href={href}
                className="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color}`}
                  >
                    {step}
                  </span>
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 group-hover:underline dark:text-gray-100">
                    {title}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {desc}
                </p>
              </Link>
            )
          )}
        </div>
      </section>

      {/* ── Section Cards ── */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            All Sections
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map(
            ({
              title,
              description,
              href,
              icon: Icon,
              color,
              bg,
              border,
              statKey,
              tip
            }) => (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col gap-3 rounded-xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${bg} ${border}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-800 ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {stats[statKey]}
                    </span>
                    <IconArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:underline dark:text-gray-100">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>

                {tip && (
                  <div className="flex items-start gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white/60 p-2 dark:border-gray-600 dark:bg-black/20">
                    <IconFolderOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">
                      {tip}
                    </p>
                  </div>
                )}
              </Link>
            )
          )}
        </div>
      </section>
    </PageContainer>
  );
}
