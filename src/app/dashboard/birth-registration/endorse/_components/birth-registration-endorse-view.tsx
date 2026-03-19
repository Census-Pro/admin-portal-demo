'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  IconUser,
  IconMapPin,
  IconHome,
  IconUsers,
  IconShieldCheck,
  IconFileText,
  IconCheck,
  IconLoader2
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';
import { BirthCertificateViewer } from '../../_components/birth-certificate-viewer';
import { updateBirthApplicationStatus } from '@/actions/common/birth-registration-actions';

interface BirthRegistrationData {
  applicant_cid: string;
  applicant_contact_no?: string;
  is_born_in_bhutan: boolean;
  applicant_is?: string;
  is_applicant_parent?: boolean;
  is_epis_registered: boolean;
  birth_country_id?: string;
  birth_city_id?: string;
  birth_dzongkhag_id?: string;
  birth_gewog_id?: string;
  birth_village_id?: string;
  // Enriched location names
  birth_country_name?: string;
  birth_city_name?: string;
  birth_dzongkhag_name?: string;
  birth_gewog_name?: string;
  birth_village_name?: string;
  dzongkhag_name?: string;
  gewog_name?: string;
  chiwog_name?: string;
  village_name?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  time_of_birth?: string;
  gender?: string;
  weight?: number;
  is_mc_valid?: boolean;
  father_cid?: string;
  fathers_contact_no?: string;
  is_father_alive?: boolean;
  mother_cid?: string;
  mothers_contact_no?: string;
  is_mother_alive?: boolean;
  guarantor_cid?: string;
  guarantor_contact_no?: string;
  relationship?: string;
  guarantor_approval?: string;
  father_approval?: string;
  mother_approval?: string;
  house_hold_no?: string;
  house_no?: string;
  tharm_no?: string;
  hoh_cid?: string;
  hoh_contact_no?: string;
  hoh_approval?: string;
  dzongkhag_id?: string;
  gewog_id?: string;
  chiwog_id?: string;
  village_id?: string;
  birth_certificate_url?: string;
  status: string;
}

interface BirthRegistrationEndorseViewProps {
  data: BirthRegistrationData;
  applicationId: string;
}

export function BirthRegistrationEndorseView({
  data,
  applicationId
}: BirthRegistrationEndorseViewProps) {
  const router = useRouter();
  const [isEndorsing, setIsEndorsing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(data.status);

  const handleEndorse = async () => {
    setIsEndorsing(true);
    try {
      const result = await updateBirthApplicationStatus(
        applicationId,
        'ENDORSED'
      );
      if (result.success) {
        setCurrentStatus('ENDORSED');
        toast.success('Birth registration endorsed successfully!');
        router.push('/dashboard/birth-registration/endorse');
      } else {
        toast.error(result.error || 'Failed to endorse birth registration');
      }
    } catch (error) {
      toast.error('An unexpected error occurred while endorsing');
    } finally {
      setIsEndorsing(false);
    }
  };

  const { variant, className: statusClassName } = getStatusColor(currentStatus);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left Side - All Information in One Card - 40% */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Birth Registration Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Child Information & Birth Location */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconUser className="h-4 w-4" />
                Child Information
              </h3>

              {data.is_epis_registered ? (
                /* ── EPIS = YES: names/gender outside, EPIS data in green border ── */
                <>
                  {/* Outside border: First Name → Gender */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        First Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.first_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Middle Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.middle_name || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Last Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.last_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Gender
                      </Label>
                      <p className="flex-1 text-sm font-medium capitalize">
                        {data.gender}
                      </p>
                    </div>
                  </div>

                  {/* Green border: Date of Birth → EPIS Registered */}
                  <div className="relative space-y-2 rounded-lg border-2 border-green-500 p-4">
                    <div className="bg-background absolute -top-3 right-4 px-2">
                      <span className="text-xs font-medium text-green-600">
                        EPIS
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Date of Birth
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {new Date(data.date_of_birth).toLocaleDateString(
                          'en-GB',
                          { day: '2-digit', month: 'short', year: 'numeric' }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Time of Birth
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.time_of_birth || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Weight (g)
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.weight != null ? `${data.weight} g` : 'N/A'}
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <IconMapPin className="h-4 w-4" />
                      Birth Location
                    </h3>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Born in Bhutan
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.is_born_in_bhutan ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Country
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_country_name ||
                          data.birth_country_id ||
                          'N/A'}
                      </p>
                    </div>
                    {(data.birth_city_name || data.birth_city_id) && (
                      <div className="flex items-start gap-4">
                        <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                          City
                        </Label>
                        <p className="flex-1 text-sm">
                          {data.birth_city_name || data.birth_city_id}
                        </p>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Dzongkhag
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_dzongkhag_name ||
                          data.birth_dzongkhag_id ||
                          'N/A'}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Gewog
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_gewog_name || data.birth_gewog_id || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Village
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_village_name ||
                          data.birth_village_id ||
                          'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        EPIS Registered
                      </Label>
                      <p className="flex-1 text-sm font-medium">Yes</p>
                    </div>
                  </div>
                </>
              ) : (
                /* ── EPIS = NO: everything in one yellow border ── */
                <div className="relative space-y-2 rounded-lg border-2 border-yellow-500 p-4">
                  <div className="bg-background absolute -top-3 right-4 px-2">
                    <span className="text-xs font-medium text-yellow-600">
                      Manual Entry
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      First Name
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.first_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Middle Name
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.middle_name || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Last Name
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.last_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Gender
                    </Label>
                    <p className="flex-1 text-sm font-medium capitalize">
                      {data.gender}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Date of Birth
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {new Date(data.date_of_birth).toLocaleDateString(
                        'en-GB',
                        { day: '2-digit', month: 'short', year: 'numeric' }
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Time of Birth
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.time_of_birth || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Weight (g)
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.weight != null ? `${data.weight} g` : 'N/A'}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconMapPin className="h-4 w-4" />
                    Birth Location
                  </h3>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Born in Bhutan
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.is_born_in_bhutan ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Country
                    </Label>
                    <p className="flex-1 text-sm">
                      {data.birth_country_name ||
                        data.birth_country_id ||
                        'N/A'}
                    </p>
                  </div>
                  {(data.birth_city_name || data.birth_city_id) && (
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        City
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_city_name || data.birth_city_id}
                      </p>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Dzongkhag
                    </Label>
                    <p className="flex-1 text-sm">
                      {data.birth_dzongkhag_name ||
                        data.birth_dzongkhag_id ||
                        'N/A'}
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Gewog
                    </Label>
                    <p className="flex-1 text-sm">
                      {data.birth_gewog_name || data.birth_gewog_id || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Village
                    </Label>
                    <p className="flex-1 text-sm">
                      {data.birth_village_name ||
                        data.birth_village_id ||
                        'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      EPIS Registered
                    </Label>
                    <p className="flex-1 text-sm font-medium">No</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Parent Information */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconUsers className="h-4 w-4" />
                Parent Information
              </h3>

              {/* Marriage Certificate Valid + Father's CID - standalone bordered box */}
              <div
                className={`relative space-y-2 rounded-lg border-2 p-3 ${data.is_mc_valid ? 'border-green-500' : 'border-yellow-400'}`}
              >
                <div className="bg-background absolute -top-3 right-3 px-2">
                  <span
                    className={`text-xs font-medium ${data.is_mc_valid ? 'text-green-600' : 'text-yellow-500'}`}
                  >
                    {data.is_mc_valid ? 'Judiciary' : 'Manual Entry'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Marriage Certificate Valid
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.is_mc_valid ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Father's CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.father_cid || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Father's Contact → HOH Approval - Manual Entry bordered box */}
              <div className="relative space-y-2 rounded-lg border-2 border-yellow-500 p-4">
                <div className="bg-background absolute -top-3 right-4 px-2">
                  <span className="text-xs font-medium text-yellow-600">
                    Manual Entry
                  </span>
                </div>

                {data.fathers_contact_no && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Father's Contact
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.fathers_contact_no}
                    </p>
                  </div>
                )}
                {data.is_father_alive != null && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Father Alive
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.is_father_alive ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}
                {data.father_approval && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Father Approval
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.father_approval}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Mother's CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.mother_cid || 'N/A'}
                  </p>
                </div>
                {data.mothers_contact_no && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Mother's Contact
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.mothers_contact_no}
                    </p>
                  </div>
                )}
                {data.is_mother_alive != null && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Mother Alive
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.is_mother_alive ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}
                {data.mother_approval && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Mother Approval
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.mother_approval}
                    </p>
                  </div>
                )}
                {data.applicant_cid && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Applicant CID
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.applicant_cid}
                    </p>
                  </div>
                )}
                {data.applicant_contact_no && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Applicant Contact
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.applicant_contact_no}
                    </p>
                  </div>
                )}
                {data.applicant_is && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Applicant Is
                    </Label>
                    <p className="flex-1 text-sm font-medium capitalize">
                      {data.applicant_is}
                    </p>
                  </div>
                )}
                {data.guarantor_cid && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Guarantor CID
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.guarantor_cid}
                    </p>
                  </div>
                )}
                {data.guarantor_contact_no && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Guarantor Contact
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.guarantor_contact_no}
                    </p>
                  </div>
                )}
                {data.relationship && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Relationship
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.relationship}
                    </p>
                  </div>
                )}
                {data.guarantor_approval && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Guarantor Approval
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.guarantor_approval}
                    </p>
                  </div>
                )}
                {data.hoh_cid && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      HOH CID
                    </Label>
                    <p className="flex-1 text-sm font-medium">{data.hoh_cid}</p>
                  </div>
                )}
                {data.hoh_contact_no && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      HOH Contact
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.hoh_contact_no}
                    </p>
                  </div>
                )}
                {data.hoh_approval && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      HOH Approval
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.hoh_approval}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconHome className="h-4 w-4" />
                Address Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Household No.
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.house_hold_no || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    House No.
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.house_no || 'N/A'}
                  </p>
                </div>
                {data.tharm_no && (
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Tharm No.
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.tharm_no}
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Dzongkhag
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.dzongkhag_name || data.dzongkhag_id || 'N/A'}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Gewog
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.gewog_name || data.gewog_id || 'N/A'}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Chiwog
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.chiwog_name || data.chiwog_id || 'N/A'}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Village
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.village_name || data.village_id || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Application Status & Endorsement Details */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconShieldCheck className="h-4 w-4" />
                Status & Endorsement
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Application Status
                  </Label>
                  <div className="flex-1">
                    <Badge variant={variant} className={statusClassName}>
                      {currentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  onClick={handleEndorse}
                  disabled={isEndorsing || currentStatus === 'ENDORSED'}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                >
                  {isEndorsing ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Endorsing...
                    </>
                  ) : (
                    <>
                      <IconCheck className="mr-2 h-4 w-4" />
                      {currentStatus === 'ENDORSED' ? 'Endorsed' : 'Endorse'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Supporting Documents and Notes - 60% */}
      <div className="space-y-6 lg:col-span-3">
        {/* Supporting Documents */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Supporting Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BirthCertificateViewer
              applicationId={applicationId}
              hasCertificateUrl={!!data.birth_certificate_url}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
