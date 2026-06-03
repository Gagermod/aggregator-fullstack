import styles from './Field.module.scss'

const Field = (props) => {
  const { id, label, type = 'text', value, onInput, ref, onClear } = props

  return (
    <div className={`${styles.field}`}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <span className={styles.decor} aria-hidden="true">
          &gt;
        </span>
        <input
          className={styles.input}
          id={id}
          placeholder=" "
          autoComplete="off"
          type={type}
          value={value}
          onInput={onInput}
          ref={ref}
        />
        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="Очистить поле"
          >
            DEL
          </button>
        )}
      </div>
    </div>
  )
}

export default Field
