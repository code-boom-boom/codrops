import RainDrop from '../pages/rain-drop'
import LionPage from '../pages/lion'
import CuteBirdPage from '../pages/cute-bird'

const routes = [
  {
    path: '/rain-drop',
    pageComponent: RainDrop,
    label: 'Rain Drop Using WebGL'
  },
  {
    path: '/lion',
    pageComponent: LionPage,
    label: 'Chilling Lion'
  },
  {
    path: '/cute-bird',
    pageComponent: CuteBirdPage,
    label: 'Cute Bird'
  }
]

export default routes
