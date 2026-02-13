'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  IconUser,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconHome,
  IconUsers,
  IconWeight,
  IconShieldCheck,
  IconFileText,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';

interface BirthRegistrationData {
  applicant_cid: string;
  is_born_in_bhutan: boolean;
  is_applicant_parent: boolean;
  is_epis_registered: boolean;
  birth_country_id: string;
  birth_city_id: string;
  birth_dzongkhag_id: string;
  birth_gewog_id: string;
  birth_village_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  time_of_birth: string;
  gender: string;
  weight: number;
  is_mc_valid: boolean;
  father_cid: string;
  mother_cid: string;
  guarantor_cid: string;
  relationship: string;
  house_hold_no: string;
  house_no: string;
  dzongkhag_id: string;
  gewog_id: string;
  village_id: string;
  birth_certificate_url: string;
  status: string;
}

interface BirthRegistrationApproveViewProps {
  data: BirthRegistrationData;
}

export function BirthRegistrationApproveView({
  data
}: BirthRegistrationApproveViewProps) {
  const [activeTab, setActiveTab] = useState('birth_certificate');

  const handleApprove = () => {
    toast.success('Birth registration approved successfully!');
    console.log('Approving birth registration...');
    // TODO: Implement approval logic
  };

  const handleReject = () => {
    toast.error('Birth registration rejected');
    console.log('Rejecting birth registration...');
    // TODO: Implement rejection logic
  };

  const { variant, className: statusClassName } = getStatusColor(data.status);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left Side - All Information in One Card - 40% */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Birth Registration Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Child Information & Birth Location - Combined */}
            <div
              className={`relative space-y-4 rounded-lg border-2 p-4 ${data.is_epis_registered ? 'border-green-500' : 'border-yellow-500'}`}
            >
              {/* Manual Entry Label */}
              <div className="bg-background absolute -top-3 right-4 px-2">
                <span
                  className={`text-xs font-medium ${data.is_epis_registered ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  Manual Entry
                </span>
              </div>

              {/* Child Information */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <IconUser className="h-4 w-4" />
                  Child Information
                </h3>
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
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Date of Birth
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {new Date(data.date_of_birth).toLocaleDateString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Time of Birth
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.time_of_birth}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Weight (kg)
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.weight} kg
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Birth Location */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <IconMapPin className="h-4 w-4" />
                  Birth Location
                </h3>
                <div className="space-y-2">
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
                      Country ID
                    </Label>
                    <p className="flex-1 text-sm">{data.birth_country_id}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Dzongkhag ID
                    </Label>
                    <p className="flex-1 text-sm">{data.birth_dzongkhag_id}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Gewog ID
                    </Label>
                    <p className="flex-1 text-sm">{data.birth_gewog_id}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Village ID
                    </Label>
                    <p className="flex-1 text-sm">{data.birth_village_id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      EPIS Registered
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.is_epis_registered ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Parent Information */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconUsers className="h-4 w-4" />
                Parent Information
              </h3>

              {/* Father, Mother, Marriage Certificate - Bordered Section */}
              <div
                className={`relative space-y-2 rounded-lg border-2 p-4 ${data.is_mc_valid ? 'border-green-500' : 'border-yellow-500'}`}
              >
                {/* Data Source Label */}
                <div className="bg-background absolute -top-3 right-4 px-2">
                  <span
                    className={`text-xs font-medium ${data.is_mc_valid ? 'text-green-600' : 'text-yellow-600'}`}
                  >
                    {data.is_mc_valid ? 'Trusted Source' : 'Manual Entry'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Father's CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.father_cid}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Mother's CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.mother_cid}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Marriage Certificate Valid
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.is_mc_valid ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {/* Rest of Parent Information - Outside Border */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Father's CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.father_cid}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Mother's CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.mother_cid}
                  </p>
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
                    Applicant CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.applicant_cid}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Is Applicant Parent
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.is_applicant_parent ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Guarantor CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.guarantor_cid}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Relationship
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.relationship}
                  </p>
                </div>
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
                    {data.house_hold_no}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    House No.
                  </Label>
                  <p className="flex-1 text-sm font-medium">{data.house_no}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Dzongkhag ID
                  </Label>
                  <p className="flex-1 text-sm">{data.dzongkhag_id}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Gewog ID
                  </Label>
                  <p className="flex-1 text-sm">{data.gewog_id}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Village ID
                  </Label>
                  <p className="flex-1 text-sm">{data.village_id}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Application Status & Approval Details */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconShieldCheck className="h-4 w-4" />
                Status & Approval
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Application Status
                  </Label>
                  <div className="flex-1">
                    <Badge variant={variant} className={statusClassName}>
                      {data.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <IconCheck className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1"
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Reject
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="birth_certificate" className="text-xs">
                  Birth Certificate
                </TabsTrigger>
                <TabsTrigger value="cid_photo" className="text-xs">
                  CID Photo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="birth_certificate" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Birth Certificate</p>
                    <Badge variant="secondary">PDF</Badge>
                  </div>
                  <div className="border-muted overflow-hidden rounded-lg border">
                    <iframe
                      src="/samepleCeritificate.pdf"
                      className="h-[600px] w-full"
                      title="Birth Certificate"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cid_photo" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">CID Photo</p>
                    <Badge variant="secondary">IMAGE</Badge>
                  </div>
                  <div className="border-muted overflow-hidden rounded-lg border">
                    <img
                      src="/sampleCid.png"
                      alt="CID Photo"
                      className="h-auto w-full object-contain"
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
