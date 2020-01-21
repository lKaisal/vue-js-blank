import axios from 'axios'
const service = axios.create({
  // baseURL: 'http://api.sm-admin-banner-service.svc.k8s.devel/api/v1',
  // headers: { Authorization: `Bearer SjXGagud3addBJsyBNtEsrxRqnyNLsVsr296afaB` }
})

export default service