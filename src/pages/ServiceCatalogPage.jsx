import CatalogView from '../components/catalog/CatalogView'
import { CATALOG_CONFIGS } from '../config/catalogConfigs'

export default function ServiceCatalogPage() {
  return <CatalogView type="service" config={CATALOG_CONFIGS.service} />
}
