import CatalogView from '../components/catalog/CatalogView'
import { CATALOG_CONFIGS } from '../config/catalogConfigs'

export default function ErrorCodeCatalogPage() {
  return <CatalogView type="errorCode" config={CATALOG_CONFIGS.errorCode} />
}
