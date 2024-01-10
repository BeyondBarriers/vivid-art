import styles from '../styles/Dashboard.module.css'

export function Header({ text }) {
    return (
        <p className={styles.header}>{text}</p>
    )
}

function Title({ text }) {
    return (
        <p className={styles.title}>{text}</p>
    )
}

function Subtitle({ text }) {
    return (
        <p className={styles.subtitle}>{text}</p>
    )
}

export function Drawing({ title, date }) {
    return (
        <div style={{width: 'fit-content' }}>
            <div className={styles.rect}></div>
            <div className={styles.rectShadow}></div>
            <Title text={title}/>
            <Subtitle text={date}/>
        </div>
    )
}

export function Group({ name, count }) {
    var members = count + ' members'
    return (
        <div style={{width: 'fit-content'}}>
            <div className={styles.circle}></div>
            <div className={styles.circleShadow}></div>
            <Title text={name}/>
            <Subtitle text={members}/>
        </div>
    )
}

export function GroupSection({ title, data }) {
    return (
        <div>
            <Header text={title}/>
            <div className={styles.section}>
                {data.map((snapshot) =>
                    <Group name={snapshot.NAME} count={snapshot.COUNT}/>
                )}
            </div>
        </div>
    )
}

export function DrawingSection({ title, data }) {
    console.log(data)
    if (data.length == 0) {
        return (
            <div>
                <Header text={title}/>
                <p>No drawings to display</p>
            </div>
        )
    } else {
        return (
            <div>
                <Header text={title}/>
                <div className={styles.section}>
                    {data.map((snapshot) => 
                        <Drawing title={snapshot.TITLE} date={snapshot.DATE}/>
                    )}
                </div>
            </div>
        )
    }
}

export function CollaborationSection({ title, data }) {
    return (
        <div>
            <Header text={title}/>
            <div className={styles.section}>
                {data.map((snapshot) => 
                    <Drawing title={snapshot.TITLE} date={snapshot.DATE}/>
                )}
            </div>
        </div>
    )
}