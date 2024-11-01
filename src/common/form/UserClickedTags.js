import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const UserClickedTags = ({
  onChange,
  getValues,
  setTagsFromUserClick = () => {},
}) => {
  const { tags } = getValues()
  const handleDeleteTag = (key) => {
    onChange('tags', [...tags.slice(0, key), ...tags.slice(key + 1)])
    setTagsFromUserClick([...tags.slice(0, key), ...tags.slice(key + 1)])
  }

  return (
    <div className={classReader('multi-select-input')}>
      <div className={classReader('tag-list')}>
        {
          tags.map( (item, index) => <div
            key={index}
            className={classReader('text-tag text-primary')}>
            {item}
            <i
              className={classReader('icon icon-close ml-1 text-tag-delete')}
              onClick={() => handleDeleteTag(index)}
            />
          </div> )
        }
      </div>
    </div>
  )
}

UserClickedTags.propTypes = { value: PropTypes.array }

export default UserClickedTags