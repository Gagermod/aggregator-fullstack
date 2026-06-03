import Field from '@/shared/ui/Field'

const SearchBloggerForm = (props) => {
  const { bloggersData } = props

  const { searchQuery, setSearchQuery } = bloggersData

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
    >
      <Field
        label="Найти автора"
        id="search-blogger"
        type="search"
        value={searchQuery}
        onInput={(event) => setSearchQuery(event.target.value)}
        onClear={() => setSearchQuery('')}
      />
    </form>
  )
}

export default SearchBloggerForm
