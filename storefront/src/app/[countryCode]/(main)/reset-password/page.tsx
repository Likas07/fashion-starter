// Components
import { Button } from "@/components/Button"
import { Layout, LayoutColumn } from "@/components/Layout"
import { Input } from "@/components/Forms"

export default function ResetPasswordPage() {
  return (
    <Layout className="py-26 md:pt-45 md:pb-36">
      <LayoutColumn
        start={{ base: 1, sm: 3, lg: 4, xl: 5 }}
        end={{ base: 13, sm: 11, lg: 10, xl: 9 }}
      >
        <h1 className="text-lg mb-6 md:mb-8">Reset password</h1>
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <Input
            type="password"
            placeholder="Current password"
            required
            variant="outline"
          />
          <Input
            type="password"
            placeholder="New password"
            required
            variant="outline"
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            required
            variant="outline"
          />
        </div>
        <Button isFullWidth>Reset password</Button>
      </LayoutColumn>
    </Layout>
  )
}
