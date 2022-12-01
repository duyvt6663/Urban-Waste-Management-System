import { DEPOT, TREAT } from '../../src/views/AppMap/AppMap'
export function checkIsDepot(x, y) {
  return x === DEPOT.latitude && y === DEPOT.longtitude
}

export function checkIsTreat(x, y) {
  return x === TREAT.latitude && y === TREAT.longtitude
}
