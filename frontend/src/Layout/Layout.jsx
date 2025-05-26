
import Header from '../component/Header'
import Footer from '../component/Footer'

const Layout = ({children}) => {
 return (
  <div>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
 )
}
export default Layout; 
      {/* Background Logo */}
     