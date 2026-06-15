import AppLayout from '~/layouts/app'
import UserForm, { defineUserEditPage } from './components/user_form'

const UsersEdit = defineUserEditPage(({ user, gasStations, roles, maxFaceImages, permissions }) => {
  return (
    <UserForm
      mode="edit"
      user={user}
      gasStations={gasStations}
      roles={roles}
      maxFaceImages={maxFaceImages}
      permissions={permissions}
    />
  )
})

UsersEdit.layout = (page) => (
  <AppLayout title="Editar usuário" description="Atualize os dados e imagens faciais do usuário.">
    {page}
  </AppLayout>
)

export default UsersEdit
