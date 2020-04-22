import { ViewportInfo } from '@/plugins/viewportSizeHandler'
import { GetterTree, MutationTree, ActionTree } from 'vuex'

const grid = require('@/styles/grid-config.json')

// Отдельный массив чисел-брейкпоинтов, отсортированный по возрастанию
grid.numbers = Object.keys(grid.breakpoints).map(key => grid.breakpoints[key]).sort((a: any, b: any) => a - b)

export type UiState = {
  windowWidth: ViewportInfo['windowWidth']
  windowHeight: ViewportInfo['windowHeight']
  documentWidth: ViewportInfo['documentWidth']
  documentHeight: ViewportInfo['documentHeight']
  scrollbarWidth: ViewportInfo['scrollbarWidth']
  breakpoint: ViewportInfo['breakpoint']
  grid: {
    columns: number,
    gutters: number,
    offsets: number
  },
  isIe: boolean,
  isEdge: boolean,
  deviceType: string,
  browser: {
    name: string
  },
  deviceOS: string,
  pixelRatio: number,
  locale: string,
  menuIsOpen: boolean
}


export const state = (): UiState  => ({
  windowWidth: null as ViewportInfo['windowWidth'],
  windowHeight: null as ViewportInfo['windowHeight'],
  documentWidth: null as ViewportInfo['documentWidth'],
  documentHeight: null as ViewportInfo['documentHeight'],
  scrollbarWidth: null as ViewportInfo['scrollbarWidth'],
  breakpoint: null as ViewportInfo['breakpoint'],
  grid,
  isIe: null,
  isEdge: null,
  deviceType: null,
  browser: null,
  deviceOS: null,
  pixelRatio: null,
  locale: null,
  menuIsOpen: null,
})

export const getters: GetterTree<UiState, UiState> = {
  screenSize({ windowHeight, windowWidth, documentWidth, documentHeight }) { return windowHeight + windowWidth + documentWidth + documentHeight },
  columns(state) { return state.grid.columns[state.breakpoint] },
  gutterWidth(state) { return state.grid.gutters[state.breakpoint] },
  offsetWidth(state) { return state.grid.offsets[state.breakpoint] },
  columnWidth(state, getters) {
    const { windowWidth } = state
    const { columns, gutterWidth, offsetWidth } = getters
    const colWidth = (windowWidth - (offsetWidth * 2) - (gutterWidth * (columns - 1))) / columns

    return colWidth
  },
  isDesktop(state) { return state.deviceType === 'desktop' },
  isTablet(state) { return state.deviceType === 'tablet' },
  isMobile(state) { return state.deviceType === 'mobile' },
  isTouchDevice(state) { return state.deviceType !== 'desktop' },
}

export const mutations: MutationTree<UiState> = {
  updateViewportInfo(state, payload: ViewportInfo) {
    state.windowWidth = payload.windowWidth
    state.windowHeight = payload.windowHeight
    state.documentWidth = payload.documentWidth
    state.documentHeight = payload.documentHeight
    state.scrollbarWidth = payload.scrollbarWidth
    state.breakpoint = payload.breakpoint
  },
  setScrollY(state, payload) { state.scrollY = payload },
  setDeviceType(state, payload: string) { state.deviceType = payload },
  isIe(state) { state.isIe = true },
  isEdge(state) { state.isEdge = true },
  setBrowser(state, payload) { state.browser = payload },
  setBreakpoint(state, payload: string) { state.breakpoint = payload },
  // setLocale(state, payload: string) { state.locale = payload },
}

export const actions: ActionTree<UiState, UiState> = {
  hideAllOverlayElements({ commit }) {
    // commit('setMenuIsOpen', false)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
