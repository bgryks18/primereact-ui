'use client'
import {
  Column,
  ColumnEditorOptions,
  ColumnEvent,
  ColumnProps,
} from 'primereact/column'
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { get } from 'lodash'
import { InputTextarea } from 'primereact/inputtextarea'
import {
  Category,
  Product,
  ProductSetting,
  Setting,
} from '@/app/lib/definitions'
import { Dropdown } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api'

const Table = ({
  data,
  categoryList,
  productSettingList,
}: {
  data: Product[]
  categoryList: Category[]
  productSettingList: Setting[]
}) => {
  const [products, setProducts] = useState<Product[]>(data)
  const [dataToEdited, setDataToEdited] = useState<Product | undefined>()

  useEffect(() => {
    console.log('p', products)
  }, [products])

  const updateProducts = async (products: Product[]) => {
    await fetch('/products/api', {
      method: 'POST',
      body: JSON.stringify({ products }),
    })
  }

  const onCellEditComplete = (e: ColumnEvent) => {
    let { rowData, newValue, field, originalEvent: event } = e
    if (typeof newValue === 'string') {
      if (newValue.trim().length > 0) rowData[field] = newValue
      else event.preventDefault()
    } else event.preventDefault()
  }
  const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const oldProducts = [...products]
    const { newData, index } = e

    const newProducts: Product[] = products.map((item: Product, i: number) => {
      if (index === i) {
        return newData as Product
      }
      return item
    })

    setProducts(newProducts)

    updateProducts(newProducts)
  }

  const columns: ColumnProps[] = [
    { field: 'Name', header: 'Name', className: 'w-[200px]' },
    {
      field: 'CategoryId',
      header: 'Category',
      className: 'w-[200px]',
      body(data) {
        const item = categoryList.find((item) => item.Id === data.CategoryId)
        return <>{item?.Name}</>
      },
      editor(options) {
        return (
          <Dropdown
            value={options.value}
            placeholder="Select a Category"
            className="w-full md:w-14rem border"
            options={categoryList}
            optionLabel="Name"
            optionValue="Id"
            onChange={(e) => {
              options.editorCallback && options.editorCallback(e.target.value)
            }}
          />
        )
      },
    },
    { field: 'Description', header: 'Description' },
    {
      field: 'ProductSettings',
      header: 'Product Settings',
      body(data) {
        const obj = get(data, 'ProductSettings')
        const value = Array.isArray(obj)
          ? obj.map((item) => item.Value).join(', ')
          : obj

        return (
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => setDataToEdited(data)}
          >
            <span> {value}</span>
          </span>
        )
      },
      editor: undefined,
    },
  ]

  const onRemoveItemFromSettingList = (rowIndex: number) => {
    setDataToEdited((prev) => {
      if (prev) {
        return {
          ...prev,
          ProductSettings: prev.ProductSettings.filter(
            (item, index) => index !== rowIndex
          ),
        }
      }
    })
  }

  const onAddItemIntoSettingList = () => {
    setDataToEdited((prev) => {
      if (prev) {
        return {
          ...prev,
          ProductSettings: [
            ...prev.ProductSettings,
            { SettingId: 0, Value: '' },
          ],
        }
      }
    })
  }

  const onSaveSettingList = () => {
    if (dataToEdited) {
      const oldProducts = [...products]

      const newProducts = products.map((item) =>
        item.Id === dataToEdited.Id
          ? { ...item, ProductSettings: dataToEdited.ProductSettings }
          : item
      )
      setProducts(newProducts)
      setDataToEdited(undefined)
      updateProducts(newProducts)
    }
  }

  return (
    <>
      {dataToEdited && (
        <Dialog
          id="dlg"
          header={dataToEdited?.Name}
          visible={Boolean(dataToEdited)}
          style={{ width: '50vw' }}
          onHide={() => {
            setDataToEdited(undefined)
          }}
        >
          <DataTable
            value={dataToEdited.ProductSettings}
            editMode="row"
            onRowEditComplete={(e: DataTableRowEditCompleteEvent) => {
              const { newData, index } = e

              const newSettings: ProductSetting[] =
                dataToEdited.ProductSettings.map(
                  (item: ProductSetting, i: number) => {
                    if (index === i) {
                      return newData as ProductSetting
                    }
                    return item
                  }
                )
              const newProducts = products.map((item) =>
                item.Id === dataToEdited.Id
                  ? { ...item, ProductSettings: newSettings }
                  : item
              )

              setDataToEdited((prev) =>
                newProducts.find((item) => item.Id === prev?.Id)
              )
            }}
          >
            <Column
              field="SettingId"
              header="Setting"
              editor={(options) => {
                return (
                  <Dropdown
                    value={options.value}
                    placeholder="Select a Type"
                    className="w-full md:w-14rem border"
                    options={productSettingList}
                    optionLabel="Name"
                    optionValue="Id"
                    onChange={(e) => {
                      options.editorCallback &&
                        options.editorCallback(e.target.value)
                    }}
                  />
                )
              }}
              body={(data) => {
                const item = productSettingList.find(
                  (item) => item.Id === data.SettingId
                )
                return (
                  <>
                    {item?.Name || <span className="italic">No Selected</span>}
                  </>
                )
              }}
              onCellEditComplete={onCellEditComplete}
            />
            <Column
              field="Value"
              header="Value"
              body={(data) => {
                return (
                  <>
                    {data.Value || <span className="italic">No Selected</span>}
                  </>
                )
              }}
              editor={(options) => {
                return (
                  <InputTextarea
                    value={options.value}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      options.editorCallback &&
                      options.editorCallback(e.target.value)
                    }
                    className="w-full h-full resize-y border p-3"
                  />
                )
              }}
              onCellEditComplete={onCellEditComplete}
            />
            <Column
              rowEditor
              headerStyle={{ width: '10%', minWidth: '8rem' }}
              bodyStyle={{ textAlign: 'center' }}
            ></Column>
            <Column
              headerClassName="w-[40px]"
              body={(data, options) => {
                return (
                  <Button
                    className="p-3 bg-blue-500 text-white hover:bg-blue-800"
                    onClick={() =>
                      onRemoveItemFromSettingList(options.rowIndex)
                    }
                  >
                    <i className={PrimeIcons.TIMES} />
                  </Button>
                )
              }}
            ></Column>
          </DataTable>
          <div className="w-100 h-[1px] bg-gray-100 mb-[20px]"></div>
          <div className="flex justify-between">
            <Button
              className="bg-blue-500 p-3 text-white hover:bg-blue-800"
              size="large"
              onClick={() => onAddItemIntoSettingList()}
            >
              Add
            </Button>
            <Button
              className="bg-blue-500 p-3 text-white hover:bg-blue-800"
              size="large"
              onClick={() => onSaveSettingList()}
            >
              Save
            </Button>
          </div>
        </Dialog>
      )}
      <DataTable
        value={products}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="!bg-gray-200 w-full rounded-xl"
        editMode="row"
        onRowEditComplete={onRowEditComplete}
      >
        {columns.map(({ field, header, ...rest }) => {
          return (
            <Column
              key={field}
              field={field}
              header={header}
              headerClassName="bg-gray-200 rounded-xl"
              editor={(options) => {
                return (
                  <InputTextarea
                    value={options.value}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      options.editorCallback &&
                      options.editorCallback(e.target.value)
                    }
                    className="w-full h-full resize-y border p-3"
                  />
                )
              }}
              onCellEditComplete={onCellEditComplete}
              {...rest}
            />
          )
        })}
        <Column
          rowEditor
          headerStyle={{ width: '10%', minWidth: '8rem' }}
          bodyStyle={{ textAlign: 'center' }}
          headerClassName="bg-gray-200 rounded-xl"
        ></Column>
      </DataTable>
    </>
  )
}

export default Table
