import { ReactNode, useEffect, useState } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import AppLayout from '~/layouts/app'
import { Button } from '~/components/ui/button'
import { ButtonWithLoader } from '~/components/ui/button-with-loader'
import { Checkbox } from '~/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { NativeSelect, NativeSelectOption } from '~/components/ui/native-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

const defaultPrices = {
  ethanolPrice: '4,09',
  gasolinePrice: '6,29',
  dieselPrice: '7,99',
} as const

function getTodayEndOfDayValue() {
  const now = new Date()
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 0, 0)

  const year = endOfDay.getFullYear()
  const month = String(endOfDay.getMonth() + 1).padStart(2, '0')
  const day = String(endOfDay.getDate()).padStart(2, '0')
  const hours = String(endOfDay.getHours()).padStart(2, '0')
  const minutes = String(endOfDay.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export default function VounchersCreate() {
  const [type, setType] = useState<'operational' | 'commercial'>('operational')
  const [maxUtilizations, setMaxUtilizations] = useState('1')
  const [isActive, setIsActive] = useState(true)
  const [expiresAt, setExpiresAt] = useState(getTodayEndOfDayValue)

  useEffect(() => {
    if (type === 'operational') {
      setMaxUtilizations('1')
      setExpiresAt(getTodayEndOfDayValue())
    }
  }, [type])

  return (
    <Form route="vounchers.store">
      {({ errors, processing }) => (
        <div className="flex flex-col gap-6">
          <FieldGroup>
            <Field data-invalid={errors.type ? 'true' : undefined}>
              <FieldLabel>Tipo do vouncher</FieldLabel>
              <input type="hidden" name="type" value={type} />
              <Tabs value={type} onValueChange={(value) => setType(value as typeof type)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="operational">Operacional</TabsTrigger>
                  <TabsTrigger value="commercial">Comercial</TabsTrigger>
                </TabsList>
                <TabsContent value={type}>
                  <FieldDescription>
                    Escolha o tipo do vouncher. Quando for operacional, o limite de utilização fica
                    travado em 1.
                  </FieldDescription>
                </TabsContent>
              </Tabs>
              <FieldError>{errors.type}</FieldError>
            </Field>

            <Field data-invalid={errors.partner ? 'true' : undefined}>
              <FieldLabel htmlFor="partner">Parceiro</FieldLabel>
              <NativeSelect
                id="partner"
                name="partner"
                aria-invalid={!!errors.partner}
                defaultValue=""
              >
                <NativeSelectOption value="" disabled>
                  Selecione um parceiro
                </NativeSelectOption>
                <NativeSelectOption value="solidy">Solidy</NativeSelectOption>
                <NativeSelectOption value="motoclub">Motoclub</NativeSelectOption>
              </NativeSelect>
              <FieldError>{errors.partner}</FieldError>
            </Field>

            <Field data-invalid={errors.maxUtilizations ? 'true' : undefined}>
              <FieldLabel htmlFor="maxUtilizations">Máximo de utilizações</FieldLabel>
              <input type="hidden" name="maxUtilizations" value={maxUtilizations} />
              <Input
                id="maxUtilizations"
                type="number"
                min="1"
                value={maxUtilizations}
                disabled={type === 'operational'}
                onChange={(event) => setMaxUtilizations(event.target.value)}
                aria-invalid={!!errors.maxUtilizations}
              />
              {type === 'operational' && (
                <FieldDescription>
                  Vounchers operacionais sempre têm apenas 1 utilização.
                </FieldDescription>
              )}
              <FieldError>{errors.maxUtilizations}</FieldError>
            </Field>

            <FieldGroup className="grid gap-6 md:grid-cols-3">
              <Field data-invalid={errors.ethanolPrice ? 'true' : undefined}>
                <FieldLabel htmlFor="ethanolPrice">Preço etanol</FieldLabel>
                <Input
                  id="ethanolPrice"
                  name="ethanolPrice"
                  type="text"
                  defaultValue={defaultPrices.ethanolPrice}
                  aria-invalid={!!errors.ethanolPrice}
                />
                <FieldError>{errors.ethanolPrice}</FieldError>
              </Field>

              <Field data-invalid={errors.gasolinePrice ? 'true' : undefined}>
                <FieldLabel htmlFor="gasolinePrice">Preço gasolina</FieldLabel>
                <Input
                  id="gasolinePrice"
                  name="gasolinePrice"
                  type="text"
                  defaultValue={defaultPrices.gasolinePrice}
                  aria-invalid={!!errors.gasolinePrice}
                />
                <FieldError>{errors.gasolinePrice}</FieldError>
              </Field>

              <Field data-invalid={errors.dieselPrice ? 'true' : undefined}>
                <FieldLabel htmlFor="dieselPrice">Preço diesel</FieldLabel>
                <Input
                  id="dieselPrice"
                  name="dieselPrice"
                  type="text"
                  defaultValue={defaultPrices.dieselPrice}
                  aria-invalid={!!errors.dieselPrice}
                />
                <FieldError>{errors.dieselPrice}</FieldError>
              </Field>
            </FieldGroup>

            <Field data-invalid={errors.expiresAt ? 'true' : undefined}>
              <FieldLabel htmlFor="expiresAt">Expira em</FieldLabel>
              <input type="hidden" name="expiresAt" value={expiresAt} />
              <Input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                disabled={type === 'operational'}
                onChange={(event) => setExpiresAt(event.target.value)}
                aria-invalid={!!errors.expiresAt}
              />
              {type === 'operational' && (
                <FieldDescription>
                  Vounchers operacionais expiram automaticamente no fim do dia atual.
                </FieldDescription>
              )}
              <FieldError>{errors.expiresAt}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="isActive">Vouncher ativo</FieldLabel>
              <FieldDescription>
                Desative se quiser criar o vouncher já indisponível para uso.
              </FieldDescription>
              <div className="flex items-center gap-3">
                <input type="hidden" name="isActive" value={String(isActive)} />
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(Boolean(checked))}
                />
                <label htmlFor="isActive" className="text-sm text-muted-foreground">
                  Disponível para uso
                </label>
              </div>
            </Field>
          </FieldGroup>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link route="vounchers.index">
              <Button type="button" variant="outline" className="w-full sm:w-fit">
                Cancelar
              </Button>
            </Link>

            <ButtonWithLoader type="submit" isLoading={processing} className="w-full sm:w-fit">
              Criar vouncher
            </ButtonWithLoader>
          </div>
        </div>
      )}
    </Form>
  )
}

VounchersCreate.layout = (page: ReactNode) => (
  <AppLayout title="Novo vouncher" description="Cadastre um novo vouncher na plataforma.">
    {page}
  </AppLayout>
)
