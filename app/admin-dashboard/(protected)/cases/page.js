import React from 'react'
import { Plus } from 'lucide-react'
import CaseTable from '@/app/admin-dashboard/components/CaseTable'
import PageHeader, { PageContainer } from '@/app/components/PageHeader'
import { LinkButton } from '@/app/components/ui'
import { getAdminOverview } from '@/lib/stats'
import { requireAdminPage } from '@/lib/currentUser'

export default async function page() {
  await requireAdminPage();
  const { cases } = await getAdminOverview();

  return (
    <PageContainer>
      <PageHeader
        title='Cases'
        description='Only published cases are visible to students.'
        actions={<LinkButton href='/admin-dashboard/create-new-case'><Plus aria-hidden /> New case</LinkButton>}
      />
      <CaseTable cases={cases} />
    </PageContainer>
  )
}
