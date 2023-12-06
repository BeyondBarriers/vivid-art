import Layout from '../../components/Layout'
import styles from '../../styles/Dashboard.module.css'
import { getDrawings, getUser } from '../../components/Utilities'
import { DrawingSection } from '../../components/DashboardUtil'
import { auth, database } from '../../configFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

export async function getServerSideProps(context) {
    const uid = context.params.dashboard
    const drawings = await getDrawings(uid)
    return {
        props: {
            DRAWINGS: drawings
        }
    }
}

function Drawings(props) {
    const [user, setUser] = useState(false)
    const router = useRouter()
    onAuthStateChanged(auth, ( user) => {
        if (!user) {
            router.push('/login')
        } else {
            setUser(true)
        }
    })
    if (user) {
        return (
            <Layout open='Drawings' user={user}>
                <DrawingSection title='Drawings' data={props.DRAWINGS}/>
            </Layout>
        )
    }
}

export default Drawings