import Layout from '../../components/Layout'
import styles from '../../styles/Dashboard.module.css'
import { getUser, getDrawings } from '../../components/Utilities'
import { CollaborationSection } from '../../components/DashboardUtil'
import { auth } from '../../configFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

export async function getServerSideProps(context) {
    const uid = context.params.dashboard
    const user = await getUser(uid)
    const drawings = await getDrawings(uid)
    return {
        props: {
            USER: user,
            DRAWINGS: drawings
        }
    }
}

function Collaboration(props) {
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
            <Layout open='Collaboration' user={props.USER}>
                <CollaborationSection title='Collaboration' data={props.DRAWINGS}/>
            </Layout>
        )
    }
}

export default Collaboration