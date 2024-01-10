import Layout from '../../components/Layout'
import styles from '../../styles/Dashboard.module.css'
import { getUser } from '../../components/Utilities'
import { DrawingSection } from '../../components/DashboardUtil'
import { auth } from '../../configFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

export async function getServerSideProps(context) {
    const uid = context.params.dashboard
    const user = await getUser(uid)
    return {
        props: {
            USER: user,
        }
    }
}

function Settings(props) {
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
            <Layout open='Settings' user={props.USER}>
                <p>Settings</p>
            </Layout>
        )
    }
}

export default Settings