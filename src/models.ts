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

declare type CreateBanner = {
  isLoading: Boolean,
  success: Boolean,
  error: String
}

interface BannersState {
  list: Banner[],
  createBanner: CreateBanner
}

export { Banner, BannersState }