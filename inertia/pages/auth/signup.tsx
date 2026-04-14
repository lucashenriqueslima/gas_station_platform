import { Form } from '@adonisjs/inertia/react'
import { ButtonWithLoader } from '~/components/ui/button-with-loader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Criar conta</h1>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Novo acesso</CardTitle>
            <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
          </CardHeader>

          <CardContent>
            <Form route="new_account.store">
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
                        autoComplete="email"
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
                        autoComplete="new-password"
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
                        autoComplete="new-password"
                        placeholder="••••••••"
                        aria-invalid={!!errors.passwordConfirmation}
                      />
                      <FieldError>{errors.passwordConfirmation}</FieldError>
                    </Field>
                  </FieldGroup>

                  <ButtonWithLoader type="submit" isLoading={processing} className="w-full">
                    Criar conta
                  </ButtonWithLoader>
                </div>
              )}
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
