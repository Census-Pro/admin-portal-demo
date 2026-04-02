'use client';

import { useState } from 'react';
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
  IconUsers,
  IconCheck,
  IconX,
  IconShieldCheck,
  IconScan
} from '@tabler/icons-react';
import { getStatusColor, getTypeColor } from '@/lib/status-utils';

// Dummy detailed data - In real app, fetch from API
const getApplicationDetails = (id: string) => {
  const dummyData: Record<string, any> = {
    '1': { status: 'SUBMITTED', name: 'Tshering Dorji' },
    '2': { status: 'SUBMITTED', name: 'Pema Lhamo' },
    '3': { status: 'SUBMITTED', name: 'Kinley Wangchuk' },
    '4': { status: 'SUBMITTED', name: 'Sonam Choden' },
    '5': { status: 'SUBMITTED', name: 'Ugyen Tshomo' },
    '6': { status: 'SUBMITTED', name: 'Chencho Namgay' },
    '7': { status: 'PENDING_VERIFICATION', name: 'Dechen Zangmo' },
    '8': { status: 'PENDING_VERIFICATION', name: 'Tenzin Phuntsho' },
    '9': { status: 'PENDING_VERIFICATION', name: 'Namgay Dema' },
    '10': { status: 'VERIFIED', name: 'Karma Tshering' },
    '11': { status: 'VERIFIED', name: 'Sangay Dema' },
    '12': { status: 'VERIFIED', name: 'Dorji Wangmo' }
  };

  const data = dummyData[id] || { status: 'SUBMITTED', name: 'Tshering Dorji' };

  // Simulate biometric similarity scores based on application ID
  const getBiometricSimilarity = (appId: string) => {
    const idNum = parseInt(appId) || 1;
    return {
      fingerprint: Math.min(95, 80 + (idNum % 15)),
      facial: Math.min(98, 85 + (idNum % 13)),
      iris: Math.min(97, 88 + (idNum % 10)),
      overall: Math.min(96, 84 + (idNum % 12)),
      status:
        idNum % 3 === 0
          ? 'verified'
          : idNum % 3 === 1
            ? 'pending'
            : 'match_found'
    };
  };

  return {
    id: id,
    applicant_name: data.name,
    applicant_cid: id === '1' ? null : '11505001234',
    date_of_birth: '2008-03-15',
    gender: 'Male',
    blood_group: 'O+',
    place_of_birth: 'Thimphu',
    dzongkhag: 'Thimphu',
    gewog: 'Chang',
    village: 'Kabesa',
    application_type: 'NEW',
    status: data.status,
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
    biometric_similarity: getBiometricSimilarity(id),
    supporting_documents: [
      {
        name: 'Passport Photo',
        status: 'Uploaded',
        url: '/sampleCid.png',
        type: 'image'
      }
    ]
  };
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const application = getApplicationDetails(applicationId);
  const statusStyle = getStatusColor(application.status);
  const typeStyle = getTypeColor(application.application_type);

  const renderActionButtons = () => {
    switch (application.status) {
      case 'PENDING_VERIFICATION':
        return (
          <>
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Verify
            </Button>
            <Button variant="destructive" className="flex-1">
              <IconX className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </>
        );
      case 'VERIFIED':
        return (
          <>
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button variant="destructive" className="flex-1">
              <IconX className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </>
        );
      default:
        return (
          <>
            <Button variant="default" className="flex-1">
              <IconCheck className="mr-2 h-4 w-4" />
              Forward to Next Stage
            </Button>
            <Button variant="destructive" className="flex-1">
              <IconX className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </>
        );
    }
  };

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

                {/* Status & Verification Section - Action Buttons Moved Here */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconShieldCheck className="h-4 w-4" />
                    Status & Verification
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Application type
                      </Label>
                      <div className="flex-1">
                        <Badge
                          variant={typeStyle.variant}
                          className={`uppercase ${typeStyle.className}`}
                        >
                          {application.application_type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Current status
                      </Label>
                      <div className="flex-1">
                        <Badge
                          variant={statusStyle.variant}
                          className={`uppercase ${statusStyle.className}`}
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                    {application.remarks && (
                      <div className="flex items-start gap-4">
                        <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                          Remarks
                        </Label>
                        <p className="flex-1 text-sm">{application.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Biometric Similarities Section */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconScan className="h-4 w-4" />
                    Biometric Similarities
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Facial Recognition
                      </Label>
                      <div className="flex flex-1 items-center gap-3">
                        <div className="flex-1">
                          <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{
                                width: `${application.biometric_similarity?.facial}%`
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-sm font-semibold tabular-nums">
                          {application.biometric_similarity?.facial}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Confidence Level
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {(application.biometric_similarity?.facial || 0) >= 90
                          ? 'High'
                          : (application.biometric_similarity?.facial || 0) >=
                              75
                            ? 'Medium'
                            : 'Low'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">{renderActionButtons()}</div>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Passport Photo</p>
                    <Badge variant="secondary">IMAGE</Badge>
                  </div>
                  <div className="border-muted overflow-hidden rounded-lg border">
                    <img
                      src="/sampleCid.png"
                      alt="Passport Photo"
                      className="h-auto w-full object-contain"
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
