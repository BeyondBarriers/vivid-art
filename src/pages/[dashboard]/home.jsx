import Layout from '../../components/Layout'
import styles from '../../styles/Dashboard.module.css'
import { getUser } from '../../components/Utilities'
import { auth } from '../../configFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

function Home() {
    const [user, setUser] = useState(false)
    const router = useRouter()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            router.push('/login')
        } else {
            setUser(true)
        }
    })
    if (user) {
        const displayName = 'Sally Jenkins' // change default later
        const userTitle = 'Title/Achievement'
        const user = {
            NAME: displayName,
            TITLE: userTitle
        }
        return (
            <Layout open='Home' user={user}>
                <p>Dashboard/Home</p>
            </Layout>
        )
    }
}

export default Home