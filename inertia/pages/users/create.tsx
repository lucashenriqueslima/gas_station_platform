import AppLayout from '~/layouts/app'
import UserForm, { defineUserCreatePage } from './components/user_form'

const UsersCreate = defineUserCreatePage(({ gasStations, roles, maxFaceImages, permissions }) => {
  return (
    <UserForm
      mode="create"
      gasStations={gasStations}
      roles={roles}
      maxFaceImages={maxFaceImages}
      permissions={permissions}
    />
  )
})

UsersCreate.layout = (page) => (
  <AppLayout title="Novo usuário" description="Crie um novo usuário.">
    {page}
  </AppLayout>
)

export default UsersCreate
