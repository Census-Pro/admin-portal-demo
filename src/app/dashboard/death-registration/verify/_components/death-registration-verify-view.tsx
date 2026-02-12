'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  IconUser,
  IconCalendar,
  IconMapPin,
  IconHome,
  IconShieldCheck,
  IconFileText,
  IconCheck,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconSkull
} from '@tabler/icons-react';

interface DeathRegistrationData {
  applicant_cid: string;
  deceased_cid: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  dzongkhag_id: string;
  gewog_id: string;
  village_id: string;
  house_hold_no: string;
  house_no: string;
  is_health_registered: boolean;
  date_of_death: string;
  time_of_death: string;
  cause_of_death: string;
  place_of_death: string;
  country_of_death_id: string;
  dzongkhag_of_death_id: string;
  gewog_of_death_id: string;
  village_of_death_id: string;
  city_id: string;
  death_certificate_url: string;
  status: string;
}

interface DeathRegistrationVerifyViewProps {
  data: DeathRegistrationData;
}

export function DeathRegistrationVerifyView({
  data
}: DeathRegistrationVerifyViewProps) {
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  const documents = [
    {
      name: 'Sample CID',
      type: 'image',
      url: '/sampleCid.png'
    },
    {
      name: 'Sample Certificate',
      type: 'pdf',
      url: '/samepleCeritificate.pdf'
    }
  ];

  const handleNextDoc = () => {
    setCurrentDocIndex((prev) => (prev + 1) % documents.length);
  };

  const handlePrevDoc = () => {
    setCurrentDocIndex(
      (prev) => (prev - 1 + documents.length) % documents.length
    );
  };

  const handleVerify = () => {
    toast.success('Death registration verified successfully!');
    console.log('Verifying death registration...');
    // TODO: Implement verification logic
  };

  const handleReject = () => {
    toast.error('Death registration rejected');
    console.log('Rejecting death registration...');
    // TODO: Implement rejection logic
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left Side - All Information in One Card - 40% */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Death Registration Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Deceased Information & Death Details - Combined */}
            <div
              className={`relative space-y-4 rounded-lg border-2 p-4 ${data.is_health_registered ? 'border-green-500' : 'border-yellow-500'}`}
            >
              {/* Data Source Label */}
              <div className="bg-background absolute -top-3 right-4 px-2">
                <span
                  className={`text-xs font-medium ${data.is_health_registered ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  {data.is_health_registered
                    ? 'Trusted Source'
                    : 'Manual Entry'}
                </span>
              </div>

              {/* Deceased Information */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <IconUser className="h-4 w-4" />
                  Deceased Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Deceased CID
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.deceased_cid}
                    </p>
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
                </div>
              </div>

              <Separator className="my-4" />

              {/* Death Details */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <IconSkull className="h-4 w-4" />
                  Death Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Date of Death
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {new Date(data.date_of_death).toLocaleDateString(
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
                      Time of Death
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.time_of_death}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Cause of Death
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.cause_of_death}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Place of Death
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.place_of_death}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Health Registered
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.is_health_registered ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Death Location */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconMapPin className="h-4 w-4" />
                Death Location
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Country ID
                  </Label>
                  <p className="flex-1 text-sm">{data.country_of_death_id}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    City ID
                  </Label>
                  <p className="flex-1 text-sm">{data.city_id}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Dzongkhag ID
                  </Label>
                  <p className="flex-1 text-sm">{data.dzongkhag_of_death_id}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Gewog ID
                  </Label>
                  <p className="flex-1 text-sm">{data.gewog_of_death_id}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Village ID
                  </Label>
                  <p className="flex-1 text-sm">{data.village_of_death_id}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Applicant & Residential Address */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconHome className="h-4 w-4" />
                Applicant & Residential Address
              </h3>
              <div className="space-y-2">
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

            {/* Application Status & Verification Details */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconShieldCheck className="h-4 w-4" />
                Status & Verification
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Application Status
                  </Label>
                  <div className="flex-1">
                    <Badge
                      variant={
                        data.status === 'PENDING'
                          ? 'secondary'
                          : data.status === 'SUBMITTED'
                            ? 'outline'
                            : data.status === 'VERIFIED'
                              ? 'default'
                              : 'destructive'
                      }
                      className={
                        data.status === 'SUBMITTED'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : ''
                      }
                    >
                      {data.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleVerify}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <IconCheck className="mr-2 h-4 w-4" />
                  Verify
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

      {/* Right Side - Supporting Documents - 60% */}
      <div className="space-y-6 lg:col-span-3">
        {/* Supporting Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="h-5 w-5" />
                Supporting Documents
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevDoc}
                  disabled={documents.length <= 1}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground text-sm">
                  {currentDocIndex + 1} / {documents.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextDoc}
                  disabled={documents.length <= 1}
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Document Name */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {documents[currentDocIndex].name}
                </p>
                <Badge variant="secondary">
                  {documents[currentDocIndex].type.toUpperCase()}
                </Badge>
              </div>

              {/* Document Viewer */}
              <div className="border-muted overflow-hidden rounded-lg border">
                {documents[currentDocIndex].type === 'image' ? (
                  <img
                    src={documents[currentDocIndex].url}
                    alt={documents[currentDocIndex].name}
                    className="h-auto w-full"
                  />
                ) : (
                  <iframe
                    src={documents[currentDocIndex].url}
                    className="h-[600px] w-full"
                    title={documents[currentDocIndex].name}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
