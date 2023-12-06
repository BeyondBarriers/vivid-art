import Layout from '../../components/Layout'
import styles from '../../styles/Dashboard.module.css'
import { getUser } from '../../components/Utilities'
import { CollaborationSection } from '../../components/DashboardUtil'
import { auth } from '../../configFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

function Collaboration() {
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
        const data = [
            {TITLE: 'New drawing!', DATE: '12-05-2023'}, 
            {TITLE: 'New drawing 2!', DATE: '12-06-2023'}, 
            {TITLE: 'New drawing 2!', DATE: '12-06-2023'}, 
            {TITLE: 'New drawing 2!', DATE: '12-06-2023'}, 
            {TITLE: 'New drawing 2!', DATE: '12-06-2023'}
        ]
        return (
            <Layout open='Collaboration' user={user}>
                <CollaborationSection title='Collaboration' data={data}/>
            </Layout>
        )
    }
}

export default Collaboration