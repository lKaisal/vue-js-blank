import { StoreOptions } from 'vuex'


declare type Banner = {
  id: number,
  createdAt: string,
  bannerImageUrl: string,
  bannerDate: string,
  sort: number,
  isActive: boolean,
  pageType: string
}
interface BannersState {
  list: Banner[]
}

export { Banner, BannersState }