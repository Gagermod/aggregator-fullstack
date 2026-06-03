import styles from './PanelTitle.module.scss'

const PanelTitle = (props) => {
  const { title, additionalDecor } = props

  return (
    <div className={styles.panelTitle}>
      <span className={styles.decorContainer} aria-hidden={true}>
        <span className={styles.decor}>$</span>
        ./
      </span>
      <h2 className="h2">{title}</h2>
      {additionalDecor ?? <span>{additionalDecor}</span>}
    </div>
  )
}

export default PanelTitle
