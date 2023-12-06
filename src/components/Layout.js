import Head from 'next/head'
import styles from '../styles/Layout.module.css'
import { NavBar, SideBar, SideBarNavBar } from '../components/Navigation'
import { Suspense } from 'react'

export function Loading() {
    return (
        <p style={{fontSize:'100px', fontWeight:'900'}}>
            Loading...
        </p>
    )
}

function Layout({ open='None', user='None', title, children }) {
    return (
        <div>
            <Head>
                <title>{title ? title + " | " : ""} Vivid Art</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar/>
            <SideBarNavBar/>
            <SideBar user={user}/>
            <div className={styles.main}>
                {children}
            </div>
        </div>
    )
}

export default Layout