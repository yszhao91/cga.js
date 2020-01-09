import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'



export default ({
    Vue,
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
}) => {
    Vue.use(ElementUI)
}