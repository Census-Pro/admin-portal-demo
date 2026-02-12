'use client';

import { useParams, useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  IconArrowLeft,
  IconUser,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconFileText,
  IconUsers
} from '@tabler/icons-react';

// Dummy detailed data - In real app, fetch from API
const getApplicationDetails = (id: string) => {
  return {
    id: id,
    applicant_name: 'Tshering Dorji',
    applicant_cid: null,
    date_of_birth: '2008-03-15',
    gender: 'Male',
    blood_group: 'O+',
    place_of_birth: 'Thimphu',
    dzongkhag: 'Thimphu',
    gewog: 'Chang',
    village: 'Kabesa',
    application_type: 'NEW',
    status: 'SUBMITTED',
    created_at: '2026-02-10T09:30:00Z',
    phone_number: '17123456',
    email: 'tshering.dorji@gmail.com',
    father_name: 'Dorji Tshering',
    father_cid: '10304001234',
    mother_name: 'Pema Wangmo',
    mother_cid: '10305002345',
    birth_certificate_number: 'BC-2008-TH-0012',
    household_number: 'HH-TH-001234',
    present_address: 'Kabesa, Chang Gewog, Thimphu',
    permanent_address: 'Kabesa, Chang Gewog, Thimphu',
    remarks: 'First time CID application. All documents verified.',
    supporting_documents: [
      { name: 'Birth Certificate', status: 'Uploaded' },
      { name: 'Census Certificate', status: 'Uploaded' },
      { name: 'Passport Photo', status: 'Uploaded' },
      { name: 'Parent CID Copies', status: 'Uploaded' }
    ]
  };
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const application = getApplicationDetails(applicationId);

  return (
    <PageContainer
      pageTitle="CID Application Details"
      pageDescription={`Application ID: ${applicationId}`}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>

        {/* Status and Type */}
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-4 py-2 text-base">
            {application.application_type}
          </Badge>
          <Badge
            variant={application.status === 'SUBMITTED' ? 'default' : 'outline'}
            className="px-4 py-2 text-base"
          >
            {application.status}
          </Badge>
        </div>

        {/* 40/60 Split Layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Column - 40% (2 columns) - All Information in One Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>CID Application Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconUser className="h-4 w-4" />
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Full Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.applicant_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Current CID Number
                      </Label>
                      <p className="flex-1 font-mono text-sm">
                        {application.applicant_cid || 'N/A (New Application)'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Date of Birth
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.date_of_birth}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Gender
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.gender}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Blood Group
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.blood_group}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Place of Birth
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.place_of_birth}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconPhone className="h-4 w-4" />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Phone Number
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.phone_number}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Email Address
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.email || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Present Address
                      </Label>
                      <p className="flex-1 text-sm">
                        {application.present_address}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Permanent Address
                      </Label>
                      <p className="flex-1 text-sm">
                        {application.permanent_address}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location Information */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconMapPin className="h-4 w-4" />
                    Location Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Dzongkhag
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.dzongkhag}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Gewog
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.gewog}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Village
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.village}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Household Number
                      </Label>
                      <p className="flex-1 font-mono text-sm">
                        {application.household_number}
                      </p>
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Father's Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.father_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Father's CID
                      </Label>
                      <p className="flex-1 font-mono text-sm">
                        {application.father_cid}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Mother's Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.mother_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Mother's CID
                      </Label>
                      <p className="flex-1 font-mono text-sm">
                        {application.mother_cid}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Information */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconCalendar className="h-4 w-4" />
                    Additional Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Birth Certificate No.
                      </Label>
                      <p className="flex-1 font-mono text-sm">
                        {application.birth_certificate_number}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Application Date
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {new Date(application.created_at).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Remarks
                      </Label>
                      <p className="flex-1 text-sm">{application.remarks}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 60% (3 columns) */}
          <div className="lg:col-span-3">
            {/* Supporting Documents */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconFileText className="h-5 w-5" />
                  Supporting Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {application.supporting_documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {doc.status}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        ✓
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Reject</Button>
          <Button variant="default">Forward to Next Stage</Button>
        </div>
      </div>
    </PageContainer>
  );
}
