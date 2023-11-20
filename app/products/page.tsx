import {
  fetchCategories,
  fetchProductSettings,
  fetchProducts,
} from '../lib/data'
import Table from '../ui/products/table'

export default async function PaginatorBasicDemo() {
  const { data: productList } = await fetchProducts()
  const { data: categoryList } = await fetchCategories()
  const { data: settingList } = await fetchProductSettings()

  return (
    <div className="card">
      <Table
        data={productList}
        categoryList={categoryList}
        productSettingList={settingList}
      />
    </div>
  )
}
