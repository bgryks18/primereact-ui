export type Product = {
  Id: number
  CategoryId: number
  Name: string
  Description: string
  ProductSettings: ProductSetting[]
}

export type ProductSetting = {
  SettingId: number
  Value: string
}

export type Setting = {
  Id: number
  Name: string
}

export type Category = {
  Id: number
  Name: string
}
