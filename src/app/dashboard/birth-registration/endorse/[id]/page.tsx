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
  title: 'Birth Registration - Endorse Details'
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
        Back to Endorsement List
      </Button>
    </Link>
  );

  if (!result.success || !result.data) {
    return (
      <PageContainer
        pageTitle="Birth Registration - Endorse Details"
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

  // Resolve location IDs to names in parallel
  const [dzongkhagRes, gewogRes, chiwogRes, villageRes] = await Promise.all([
    appData.dzongkhag_id ? getDzongkhagById(appData.dzongkhag_id) : null,
    appData.gewog_id ? getGewogById(appData.gewog_id) : null,
    appData.chiwog_id ? getChiwogById(appData.chiwog_id) : null,
    appData.village_id ? getVillageById(appData.village_id) : null
  ]);

  const enrichedData = {
    ...appData,
    dzongkhag_name:
      dzongkhagRes && !dzongkhagRes.error
        ? dzongkhagRes.name
        : appData.dzongkhag_name,
    gewog_name:
      gewogRes && !gewogRes.error ? gewogRes.name : appData.gewog_name,
    chiwog_name:
      chiwogRes && !chiwogRes.error ? chiwogRes.name : appData.chiwog_name,
    village_name:
      villageRes && !villageRes.error ? villageRes.name : appData.village_name
  };

  return (
    <PageContainer
      pageTitle="Birth Registration - Endorse Details"
      pageDescription={`Reviewing birth registration application #${id}`}
      pageHeaderAction={backButton}
    >
      <BirthRegistrationEndorseView data={enrichedData} applicationId={id} />
    </PageContainer>
  );
}
