import Image from 'next/image'
import styles from '../styles/Auth.module.css'
import { useRouter } from 'next/router'

export function Left({ setup, children }) {
    const router = useRouter()
    var background = '/backgrounds/login.svg'
    if (setup) {
        background = '/backgrounds/signup.svg'
    }
    return (
        <div style={{overflow:'hidden'}}>
            <Image
                priority
                fill
                src={background}
                alt='background'
                className={styles.background}
            />
            <div className={styles.logo}
                style={{right: '16%'}}
                onClick={() => router.push('/')}>
                <Image
                    priority
                    width={250}
                    height={500}
                    layout='intrinsic'
                    src='/icons/vividArtLogo.svg'
                    alt='vivid art'
                    style={{width: '100%'}}
                />
            </div>
            <div style={{right: '16%'}} className={styles.logoShadow}></div>
            {children}
        </div>
    )
}

export function Right({ children }) {
    const router = useRouter()
    return (
        <div style={{overflow:'hidden'}}>
            <Image
                priority
                fill
                src='/backgrounds/signup.svg'
                alt='background'
                className={styles.background}
            />
            <div className={styles.logo}
                style={{left: '17%'}}
                onClick={() => router.push('/')}>
                <Image
                    priority
                    width={250}
                    height={500}
                    layout='intrinsic'
                    src='/icons/vividArtLogo.svg'
                    alt='vivid art'
                    style={{width: '100%'}}
                />
            </div>
            <div style={{left: '17%'}} className={styles.logoShadow}></div>
            {children}
        </div>
    )
}