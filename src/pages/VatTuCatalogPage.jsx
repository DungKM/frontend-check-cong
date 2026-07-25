import CatalogView from '../components/catalog/CatalogView'
import { CATALOG_CONFIGS } from '../config/catalogConfigs'

export default function VatTuCatalogPage() {
  return <CatalogView type="vatTu" config={CATALOG_CONFIGS.vatTu} />
}
