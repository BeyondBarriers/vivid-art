import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'
import { Inter } from 'next/font/google'
import useWindowSize from '../hooks/useWindowSize'

const inter = Inter({ subsets: ['latin'] })

function Home() {
    return (
        <Layout title='Home'>
            <div>
                <p>Test Coloring App</p>
            </div>
        </Layout>
    )
}

export default Home