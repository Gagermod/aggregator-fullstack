import styles from './Panel.module.scss'

const Panel = (props) => {
  const { children, variant } = props
  
  const panelClassName = `${styles.panel} ${variant ? styles[variant] : ''}`

  return <div className={panelClassName}>{children}</div>
}

export default Panel
