import CatalogView from '../components/catalog/CatalogView'
import { CATALOG_CONFIGS } from '../config/catalogConfigs'

export default function DoctorCatalogPage() {
  return <CatalogView type="doctor" config={CATALOG_CONFIGS.doctor} />
}
