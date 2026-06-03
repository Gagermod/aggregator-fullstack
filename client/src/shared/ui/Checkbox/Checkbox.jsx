import styles from './Checkbox.module.scss'

const Checkbox = (props) => {
  const { name, text, id, checked, onChange } = props

  return (
    <div
      className={`${styles.checkbox} ${checked ? styles.active : ''}`}
      onClick={(event) => event.stopPropagation()}
    >
      <label className={`visually-hidden`} htmlFor={id}>
        {name}
      </label>
      <input
        className="visually-hidden"
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className={styles.starLabel} htmlFor={id}>
        <span aria-hidden="true">{checked ? '[x]' : '[_]'}</span>
        {text && <span className={styles.text}>{text}</span>}
      </label>
    </div>
  )
}

export default Checkbox
