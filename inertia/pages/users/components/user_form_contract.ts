import React from 'react'
import { Data } from '@generated/data'

type UserFormProps =
  | ({ mode: 'create' } & Data.User.Variants['toCreateView'])
  | ({ mode: 'edit' } & Data.User.Variants['toEditView'])

export function defineUserFormComponent(render: (props: UserFormProps) => React.ReactNode) {
  return render as (props: UserFormProps) => React.ReactNode
}

export function defineUserCreatePage(
  render: (props: Data.User.Variants['toCreateView']) => React.ReactNode
) {
  return render as ((props: Data.User.Variants['toCreateView']) => React.ReactNode) & {
    layout?: (page: React.ReactNode) => React.ReactNode
  }
}

export function defineUserEditPage(
  render: (props: Data.User.Variants['toEditView']) => React.ReactNode
) {
  return render as ((props: Data.User.Variants['toEditView']) => React.ReactNode) & {
    layout?: (page: React.ReactNode) => React.ReactNode
  }
}
