import Layout from '../../components/Layout'
import styles from '../../styles/Dashboard.module.css'
import { getUser } from '../../components/Utilities'
import { GroupSection } from '../../components/DashboardUtil'
import { auth } from '../../configFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

function Groups() {
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
            {NAME: 'Fantastic Four', COUNT: '14'},
            {NAME: 'Fantastic Two', COUNT: '12'},
            {NAME: 'Fantastic Three', COUNT: '13'},
            {NAME: 'Fantastic Five', COUNT: '15'},
            {NAME: 'Fantastic Six', COUNT: '16'},
            {NAME: 'Fantastic Seven', COUNT: '17'}
        ]
        return (
            <Layout open='Groups' user={user}>
                <GroupSection title='Groups' data={data}/>
            </Layout>
        )
    }
}

export default Groups