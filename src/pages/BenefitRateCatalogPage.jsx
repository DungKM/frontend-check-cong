import CatalogView from '../components/catalog/CatalogView'
import { CATALOG_CONFIGS } from '../config/catalogConfigs'

export default function BenefitRateCatalogPage() {
  return <CatalogView type="benefitRate" config={CATALOG_CONFIGS.benefitRate} />
}
