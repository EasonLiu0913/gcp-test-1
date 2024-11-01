import { handleHeadParams } from 'utils/util'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)

  return {
    redirect: {
      destination: '/dashboard',
      // destination: '/login',
      permanent: true,
    },
    props: { ...headParams }, 
  }
}

const Home = (props) => {}
export default Home