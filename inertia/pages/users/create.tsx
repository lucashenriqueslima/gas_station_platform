import { ReactNode } from 'react'
import { Form } from '@adonisjs/inertia/react'
import AppLayout from '~/layouts/app'
import { ButtonWithLoader } from '~/components/ui/button-with-loader'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

export default function UsersCreate() {
  return (
    <Form route="users.store">
      {({ errors, processing }) => (
        <div className="flex flex-col gap-6">
          <FieldGroup>
            <Field data-invalid={errors.fullName ? 'true' : undefined}>
              <FieldLabel htmlFor="fullName">Nome</FieldLabel>
              <Input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Seu nome"
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
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

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

          <ButtonWithLoader type="submit" isLoading={processing} className="w-full sm:w-fit">
            Criar
          </ButtonWithLoader>
        </div>
      )}
    </Form>
  )
}

UsersCreate.layout = (page: ReactNode) => (
  <AppLayout title="Novo usuário" description="Crie um novo usuário.">
    {page}
  </AppLayout>
)
