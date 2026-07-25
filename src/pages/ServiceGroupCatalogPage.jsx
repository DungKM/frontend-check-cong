import CatalogView from '../components/catalog/CatalogView'
import { CATALOG_CONFIGS } from '../config/catalogConfigs'

export default function ServiceGroupCatalogPage() {
  return <CatalogView type="serviceGroup" config={CATALOG_CONFIGS.serviceGroup} />
}
