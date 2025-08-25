import { createFileRoute } from '@tanstack/react-router'
import ContentWrapper from '../../components/layout/ContentWrapper'
import { SmartGamesFetcher } from '../../components/dev'

function DataDemoContent() {
  return (
    <ContentWrapper 
      title="Smart Data Layer Demo" 
      subtitle="Interactive demo of the intelligent NFL data fetching system"
    >
      <SmartGamesFetcher />
    </ContentWrapper>
  )
}

export const Route = createFileRoute('/_authenticated/data-demo')({
  component: DataDemoContent,
})

export default DataDemoContent