import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconShieldOff, IconHome, IconArrowLeft } from '@tabler/icons-react';
import { auth } from '@/auth';

export default async function UnauthorizedPage() {
  const session = await auth();
  const userName = session?.user?.fullName || 'User';

  return (
    <PageContainer
      pageTitle="Access Denied"
      pageDescription="You don't have permission to access this page"
    >
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-destructive/10 rounded-full p-6">
                <IconShieldOff className="text-destructive h-16 w-16" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Sorry, <span className="font-semibold">{userName}</span>
              </p>
              <p className="text-muted-foreground">
                You don't have the required permissions to view this page.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-muted-foreground text-sm">
                If you believe you should have access to this page, please
                contact your system administrator or supervisor to request the
                necessary permissions.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="default">
                <Link href="/dashboard">
                  <IconHome className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/profile">
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
            </div>

            <div className="text-muted-foreground pt-4 text-xs">
              <p>Error Code: 403 - Forbidden</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
