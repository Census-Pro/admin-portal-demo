import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { DeathRegistrationApproveView } from '../_components/death-registration-approve-view';
import { getDeathApplicationById } from '@/actions/common/death-registration-actions';
import { getDzongkhagById } from '@/actions/common/dzongkhag-actions';
import { getGewogById } from '@/actions/common/gewog-actions';
import { getVillageById } from '@/actions/common/village-actions';
import { getCountryById } from '@/actions/common/country-actions';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Approve Death Registration'
};

async function resolveName(
  fn: (id: string) => Promise<any>,
  id: string | null | undefined
): Promise<string> {
  if (!id) return 'N/A';
  try {
    const result = await fn(id);
    return result?.name || id;
  } catch {
    return id;
  }
}

export default async function DeathRegistrationApproveDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getDeathApplicationById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const d = result.data;

  // Resolve all location IDs to names in parallel
  const [
    dzongkhagName,
    gewogName,
    villageName,
    dzongkhagOfDeathName,
    gewogOfDeathName,
    villageOfDeathName,
    countryOfDeathName
  ] = await Promise.all([
    resolveName(getDzongkhagById, d.dzongkhag_id),
    resolveName(getGewogById, d.gewog_id),
    resolveName(getVillageById, d.village_id),
    resolveName(getDzongkhagById, d.dzongkhag_of_death_id),
    resolveName(getGewogById, d.gewog_of_death_id),
    resolveName(getVillageById, d.village_of_death_id),
    resolveName(getCountryById, d.country_of_death_id)
  ]);

  const resolvedData = {
    ...d,
    dzongkhag_name: dzongkhagName,
    gewog_name: gewogName,
    village_name: villageName,
    dzongkhag_of_death_name: dzongkhagOfDeathName,
    gewog_of_death_name: gewogOfDeathName,
    village_of_death_name: villageOfDeathName,
    country_of_death_name: countryOfDeathName
  };

  return (
    <PageContainer
      pageTitle="Approve Death Registration"
      pageDescription="Review and approve the death registration"
    >
      <div className="space-y-4">
        <Link href="/dashboard/death-registration/approve">
          <Button variant="outline" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Approval List
          </Button>
        </Link>

        <Suspense fallback={<div>Loading...</div>}>
          <DeathRegistrationApproveView
            data={resolvedData}
            applicationId={id}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
