import PageContainer from '@/components/layout/page-container';
import { BirthRegistrationEndorseView } from '../_components/birth-registration-endorse-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { getBirthApplicationById } from '@/actions/common/birth-registration-actions';
import { getDzongkhagById } from '@/actions/common/dzongkhag-actions';
import { getGewogById } from '@/actions/common/gewog-actions';
import { getChiwogById } from '@/actions/common/chiwog-actions';
import { getVillageById } from '@/actions/common/village-actions';

export const metadata = {
  title: 'Birth Registration - Verify Details'
};

interface EndorseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EndorseDetailPage({
  params
}: EndorseDetailPageProps) {
  const { id } = await params;

  const result = await getBirthApplicationById(id);

  const backButton = (
    <Link href="/dashboard/birth-registration/endorse">
      <Button variant="outline">
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Back to Verify List
      </Button>
    </Link>
  );

  if (!result.success || !result.data) {
    return (
      <PageContainer
        pageTitle="Birth Registration - Verify Details"
        pageDescription="Unable to load application"
        pageHeaderAction={backButton}
      >
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-gray-500">
          <p className="font-medium">Failed to load birth application</p>
          <p className="text-xs text-gray-400">{result.error}</p>
        </div>
      </PageContainer>
    );
  }

  const appData = result.data;

  // Resolve location IDs to names in parallel - handle missing properties
  const [dzongkhagRes, gewogRes, chiwogRes, villageRes] = await Promise.all([
    (appData as any).dzongkhag_id
      ? getDzongkhagById((appData as any).dzongkhag_id)
      : null,
    (appData as any).gewog_id ? getGewogById((appData as any).gewog_id) : null,
    (appData as any).chiwog_id
      ? getChiwogById((appData as any).chiwog_id)
      : null,
    (appData as any).village_id
      ? getVillageById((appData as any).village_id)
      : null
  ]);

  const enrichedData = {
    ...appData,
    dzongkhag_name:
      dzongkhagRes && 'name' in dzongkhagRes
        ? dzongkhagRes.name
        : (appData as any).dzongkhag_name,
    gewog_name:
      gewogRes && 'name' in gewogRes
        ? gewogRes.name
        : (appData as any).gewog_name,
    chiwog_name:
      chiwogRes && 'name' in chiwogRes
        ? chiwogRes.name
        : (appData as any).chiwog_name,
    village_name:
      villageRes && 'name' in villageRes
        ? villageRes.name
        : (appData as any).village_name
  };

  return (
    <PageContainer
      pageTitle="Birth Registration - Verify Details"
      pageDescription={`Reviewing birth registration application #${id}`}
      pageHeaderAction={backButton}
    >
      <BirthRegistrationEndorseView data={enrichedData} applicationId={id} />
    </PageContainer>
  );
}
