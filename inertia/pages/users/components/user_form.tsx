import { useState } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import { ImagePlus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { ButtonWithLoader } from '~/components/ui/button-with-loader'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { NativeSelect, NativeSelectOption } from '~/components/ui/native-select'
import { defineUserFormComponent } from './user_form_contract'

export { defineUserCreatePage, defineUserEditPage } from './user_form_contract'

const UserForm = defineUserFormComponent((props) => {
  const [faceImagesError, setFaceImagesError] = useState('')
  const [selectedFaceImagesCount, setSelectedFaceImagesCount] = useState(0)
  const isEdit = props.mode === 'edit'
  const user = isEdit ? props.user : undefined
  const gasStations = props.gasStations
  const roles = props.roles
  const maxFaceImages = props.maxFaceImages
  const canChooseRole = props.permissions.chooseRole

  const formAction = isEdit && user ? `/usuarios/${user.id}` : '/usuarios'
  const formMethod = isEdit ? 'put' : 'post'

  return (
    <Form
      action={formAction}
      method={formMethod}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget)
        const faceImages = [
          ...formData.getAll('faceImages'),
          ...formData.getAll('faceImages[]'),
        ].filter((value) => value instanceof File)
        const hasInvalidCreateCount = !isEdit && faceImages.length !== maxFaceImages
        const hasInvalidEditCount =
          isEdit && faceImages.length > 0 && faceImages.length !== maxFaceImages

        if (hasInvalidCreateCount || hasInvalidEditCount) {
          event.preventDefault()
          setFaceImagesError(`Selecione exatamente ${maxFaceImages} imagens.`)
        }
      }}
      encType="multipart/form-data"
    >
      {({ errors, processing }) => (
        <div className="flex flex-col gap-6">
          <FieldGroup>
            <Field data-invalid={errors.fullName ? 'true' : undefined}>
              <FieldLabel htmlFor="fullName">Nome</FieldLabel>
              <Input
                type="text"
                name="fullName"
                id="fullName"
                defaultValue={user?.fullName ?? ''}
                placeholder="Nome completo"
                aria-invalid={!!errors.fullName}
              />
              <FieldError>{errors.fullName}</FieldError>
            </Field>

            <Field data-invalid={errors.email ? 'true' : undefined}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                type="email"
                name="email"
                id="email"
                defaultValue={user?.email ?? ''}
                placeholder="usuario@email.com"
                aria-invalid={!!errors.email}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            {!isEdit && (
              <FieldGroup className="grid gap-6 md:grid-cols-2">
                <Field data-invalid={errors.password ? 'true' : undefined}>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                  />
                  <FieldError>{errors.password}</FieldError>
                </Field>

                <Field data-invalid={errors.passwordConfirmation ? 'true' : undefined}>
                  <FieldLabel htmlFor="passwordConfirmation">Confirmar senha</FieldLabel>
                  <Input
                    type="password"
                    name="passwordConfirmation"
                    id="passwordConfirmation"
                    placeholder="••••••••"
                    aria-invalid={!!errors.passwordConfirmation}
                  />
                  <FieldError>{errors.passwordConfirmation}</FieldError>
                </Field>
              </FieldGroup>
            )}

            <FieldGroup className="grid gap-6 md:grid-cols-2">
              {canChooseRole ? (
                <Field data-invalid={errors.role ? 'true' : undefined}>
                  <FieldLabel htmlFor="role">Perfil</FieldLabel>
                  <NativeSelect
                    id="role"
                    name="role"
                    defaultValue={user?.role ?? roles[0]?.value ?? 'attendant'}
                    aria-invalid={!!errors.role}
                  >
                    {roles.map(({ value, label }) => (
                      <NativeSelectOption key={value} value={value}>
                        {label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  <FieldError>{errors.role}</FieldError>
                </Field>
              ) : (
                <input type="hidden" name="role" value={user?.role ?? 'attendant'} />
              )}

              <Field data-invalid={errors.gasStationId ? 'true' : undefined}>
                <FieldLabel htmlFor="gasStationId">Posto</FieldLabel>
                <NativeSelect
                  id="gasStationId"
                  name="gasStationId"
                  defaultValue={user?.gasStationId ? String(user.gasStationId) : ''}
                  required
                  aria-invalid={!!errors.gasStationId}
                >
                  <NativeSelectOption value="" disabled>
                    Selecione um posto
                  </NativeSelectOption>
                  {gasStations.map((gasStation) => (
                    <NativeSelectOption key={gasStation.id} value={String(gasStation.id)}>
                      {gasStation.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldError>{errors.gasStationId}</FieldError>
              </Field>
            </FieldGroup>

            <Field data-invalid={faceImagesError || errors.faceImages ? 'true' : undefined}>
              <FieldLabel htmlFor="faceImages" className="items-center">
                <ImagePlus className="h-4 w-4" />
                Imagens faciais
              </FieldLabel>
              <Input
                id="faceImages"
                name="faceImages[]"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const nextCount = event.target.files?.length ?? 0
                  const hasInvalidCreateCount = !isEdit && nextCount !== maxFaceImages
                  const hasInvalidEditCount =
                    isEdit && nextCount > 0 && nextCount !== maxFaceImages

                  setSelectedFaceImagesCount(nextCount)
                  setFaceImagesError(
                    hasInvalidCreateCount || hasInvalidEditCount
                      ? `Selecione exatamente ${maxFaceImages} imagens.`
                      : ''
                  )
                }}
                aria-invalid={!!faceImagesError || !!errors.faceImages}
              />
              <FieldDescription>
                {isEdit
                  ? `Para substituir, selecione exatamente ${maxFaceImages} imagens do rosto do usuário.`
                  : `Selecione exatamente ${maxFaceImages} imagens do rosto do usuário.`}
                {selectedFaceImagesCount > 0 && ` ${selectedFaceImagesCount} selecionada(s).`}
              </FieldDescription>
              <FieldError>{faceImagesError || errors.faceImages}</FieldError>
            </Field>
          </FieldGroup>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button asChild variant="outline" className="w-full sm:w-fit">
              <Link route="users.index">Cancelar</Link>
            </Button>

            <ButtonWithLoader
              type="submit"
              isLoading={processing}
              disabled={!!faceImagesError}
              className="w-full sm:w-fit"
            >
              {isEdit ? 'Salvar usuário' : 'Criar usuário'}
            </ButtonWithLoader>
          </div>
        </div>
      )}
    </Form>
  )
})

export default UserForm
