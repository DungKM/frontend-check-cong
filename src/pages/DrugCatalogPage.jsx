import CatalogView from '../components/catalog/CatalogView'
import { CATALOG_CONFIGS } from '../config/catalogConfigs'

export default function DrugCatalogPage() {
  return <CatalogView type="drug" config={CATALOG_CONFIGS.drug} />
}
