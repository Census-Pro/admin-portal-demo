import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  IconUser,
  IconMapPin,
  IconPhone,
  IconFileText,
  IconUsers,
  IconShieldCheck,
  IconInfoCircle
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';
import { getCIDApplicationById } from '@/actions/issuance/cid-issuance-actions';
import { format } from 'date-fns';
import { BackButton } from '@/components/ui/back-button';
import { ApplicationActions } from './_components/application-actions';
import { ApplicationPhoto } from './_components/application-photo';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch application from API
  const result = await getCIDApplicationById(id);

  if (result.error || !result.application) {
    return (
      <PageContainer
        pageTitle="Application Not Found"
        pageDescription="The requested CID application could not be found."
      >
        <Alert variant="destructive">
          <IconInfoCircle className="h-4 w-4" />
          <AlertDescription>
            {result.message || 'Application not found'}
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  const application = result.application;

  // Combine name fields
  const fullName = [
    application.first_name,
    application.middle_name,
    application.last_name
  ]
    .filter(Boolean)
    .join(' ');

  const statusStyle = getStatusColor(application.status);

  // Construct proxy URL for photo (similar to announcements)
  // MinIO URLs need to be proxied through the backend to avoid CORS issues
  const getPhotoUrl = (photoUrl: string | undefined) => {
    if (!photoUrl) return null;

    // If it's already a full URL, return as is
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }

    // Use issuance service proxy URL
    // Format: http://localhost:5010/media/{objectName}
    // Example: issuance-service/cid-photos/2026/file.png
    // Becomes: http://localhost:5010/media/issuance-service/cid-photos/2026/file.png
    const issuanceServiceUrl =
      process.env.ISSUANCE_SERVICE || 'http://localhost:5010';
    const proxyUrl = `${issuanceServiceUrl}/media/${photoUrl}`;

    return proxyUrl;
  };

  const photoUrl = getPhotoUrl(application.photo_url);

  return (
    <PageContainer
      pageTitle="CID Application Details"
      pageDescription={`Application No: ${application.application_no}`}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <BackButton />

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
                        Application No
                      </Label>
                      <p className="flex-1 font-mono text-sm font-medium">
                        {application.application_no}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Full Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">{fullName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        CID Number
                      </Label>
                      <p className="flex-1 font-mono text-sm">
                        {application.cid_no || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Date of Birth
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {format(
                          new Date(application.date_of_birth),
                          'MMM dd, yyyy'
                        )}
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
                        Applicant Contact
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.applicant_contact_no || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Parent Contact
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {application.parent_contact_no}
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
                        Parent CID
                      </Label>
                      <p className="flex-1 font-mono text-sm">
                        {application.parent_cid_no}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Parent Approval
                      </Label>
                      <div className="flex-1">
                        <Badge
                          variant={
                            application.parent_approval === 'APPROVED'
                              ? 'default'
                              : application.parent_approval === 'PENDING'
                                ? 'secondary'
                                : 'destructive'
                          }
                          className="uppercase"
                        >
                          {application.parent_approval}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Status Section */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconShieldCheck className="h-4 w-4" />
                    Status & Dates
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Current Status
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
                    {application.createdAt && (
                      <div className="flex items-center gap-4">
                        <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                          Submitted Date
                        </Label>
                        <p className="flex-1 text-sm">
                          {format(
                            new Date(application.createdAt),
                            'MMM dd, yyyy HH:mm'
                          )}
                        </p>
                      </div>
                    )}
                    {application.updatedAt && (
                      <div className="flex items-center gap-4">
                        <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                          Last Updated
                        </Label>
                        <p className="flex-1 text-sm">
                          {format(
                            new Date(application.updatedAt),
                            'MMM dd, yyyy HH:mm'
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <ApplicationActions application={application} />
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
                  <ApplicationPhoto
                    photoUrl={photoUrl}
                    originalPhotoUrl={application.photo_url}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
