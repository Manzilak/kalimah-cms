'use strict'

import { kmSettings } from '../../public/settings'

const state = {
  XbUrl: kmSettings.XbUrl,
  XbPath: kmSettings.XbPath,
  XbUser: kmSettings.XbUser,
  XbProject: kmSettings.XbProject,
  XbDirectory: kmSettings.XbDirectory,
  XbProfiles: kmSettings.XbProfiles,
  XbAppID: kmSettings.XbAppID
}

export default {
  state
}
