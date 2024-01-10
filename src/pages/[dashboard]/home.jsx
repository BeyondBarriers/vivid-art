import Layout from '../../components/Layout'
import styles from '../../styles/Dashboard.module.css'
import { getUser, getDrawings } from '../../components/Utilities'
import { auth } from '../../configFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

export async function getServerSideProps(context) {
    const uid = context.params.dashboard
    const drawings = await getDrawings(uid)
    const user = await getUser(uid)
    return {
        props: {
            USER: user,
            DRAWINGS: drawings
        }
    }
}

function Home(props) {
    const [user, setUser] = useState(false)
    const router = useRouter()
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            router.push('/login')
        } else {
            setUser(true)
        }
    })
    if (user) {
        return (
            <Layout open='Home' user={props.USER}>
                <p>Dashboard/Home</p>
            </Layout>
        )
    }
}

export default Home