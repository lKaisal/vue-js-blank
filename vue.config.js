module.exports = {
  devServer: {
    // port: 8080,
    proxy: {
      '/api/v1': {
        // target: 'http://api.sm-admin-banner-service.svc.k8s.devel/api/v1',
        target: 'http://localhost:8080/',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api/v1': ''
        // }
      }
    }
  }
}
