import ResetPasswordForm from '@/components/forms/reset-password-form'

export default async function Page({ params }: { params: Promise<{ resetSenha: string }> }) {
  const resetSenha = (await params).resetSenha

  return (
    <div className="relative h-screen flex-col items-center justify-center ">
      <ResetPasswordForm idResetSenha={resetSenha} />
    </div>
  )
}
