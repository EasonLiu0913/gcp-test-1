import React, {
  memo,
  useState,
  useEffect, 
} from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { rules } from 'utils/validation'
import classReader from 'utils/classReader'

import Button from 'common/Button'
import Input from 'common/form/Input'
import Select from 'common/form/Select'
import Loading from 'common/Loading'
import RadioGroup from 'common/form/RadioGroup'
import CheckboxGroup from 'common/form/CheckboxGroup'
import Checkbox from 'common/form/Checkbox'
import Radio from 'common/form/Radio'
import Badge from 'common/Badge'
import Breadcrumbs from 'common/Breadcrumbs'
import Modal from 'common/Modal'
import Toggle from 'common/form/Toggle'
import AutoComplete from 'common/form/AutoComplete'
import { FORM_VALIDATES_MSG } from 'config/formValidates'
import { UI_VIEW } from 'config/config'

const FORM_VALIDATES = {
  inputTest: {
    required: (val) => rules.regularString(val) || `${FORM_VALIDATES_MSG.pinWrongFormat}1`,
    isUnderLength: (val) => val?.length >= 6 || `${FORM_VALIDATES_MSG.pinWrongFormat}2`,
  },
  selectTest: { isUnderLength: (val) => val?.length >= 6 || `${FORM_VALIDATES_MSG.pinWrongFormat}3` },
  // checkedTest: { isUnderLength: (val) => val?.length >= 6 || `${FORM_VALIDATES_MSG.pinWrongFormat}3` }
}

const BREADCRUMB_OPTIONS = [
  {
    label: 'Set Link Color',
    icon: 'schedule',
    color: 'teal',
    link: 'http://localhost:3000/',
  },
  {
    label: 'Default Link Color',
    icon: 'settings',
    // color: 'orange',
    link: 'http://localhost:3000/',
  },
  {
    label: 'No Link',
    // icon: 'shopping-cart',
    color: '',
  },
]

const SELECT_OPTIONS = [
  {
    label: 'Google',
    value: 'google',
    // icon: 'calendar',
    // caption: 'Search engine'
  },
  {
    label: 'Facebook',
    value: 'facebook',
    // icon: 'calendar'
    // caption: 'Social media'
  },
  {
    label: 'Twitter',
    value: 'twitter',
    // icon: 'calendar'
    // caption: 'Quick updates'
  },
  {
    label: 'Apple',
    value: 'apple',
    // icon: 'calendar',
    // caption: 'iStuff'
  },
  {
    label: 'Oracle',
    value: 'oracle',
    // icon: 'calendar',
    // caption: 'Databases'
  },
  {
    label: 'Google2',
    value: 'google2',
    // icon: 'calendar',
    // caption: 'Search engine'
  },
  {
    label: 'Facebook2',
    value: 'facebook2',
    // icon: 'calendar'
    // caption: 'Social media'
  },
  {
    label: 'Twitter2',
    value: 'twitter2',
    // icon: 'calendar'
    // caption: 'Quick updates'
  },
  {
    label: 'Apple2',
    value: 'apple2',
    // icon: 'calendar',
    // caption: 'iStuff2'
  },
  {
    label: 'Oracle2',
    value: 'oracle2',
    // icon: 'calendar',
    // caption: 'Databases2'
  },
]

const RADIO_OPTIONS = [
  {
    label: 'Battery too low',
    value: 'bat', 
  },
  {
    label: 'Friend request',
    value: 'friend',
    color: 'teal',
  },
  {
    label: 'Picture uploaded',
    value: 'upload',
    color: 'red',
  },
]

const CHECK_OPTIONS = [
  {
    label: 'Battery too low',
    value: 'bat',
    checked: false,
  },
  {
    label: 'Friend request',
    value: 'friend',
    checked: false,
    color: 'teal',
  },
  {
    label: 'Picture uploaded',
    value: 'upload',
    checked: false,
    color: 'red',
  },
]

const BREADCRUMB = [
  {
    label: '首頁',
    icon: 'home',
    color: 'teal',
    link: '/',
  },
  {
    label: 'UI',
    link: '/ui',
  },
  {
    label: 'UI Component',
    link: '/ui/ui-view',
  },
]

const initialLoginForm = {
  inputTest: '123',
  selectTest: 'google',
  checkTest: 'friend',
  radioTest: '',
  checkGroupTest: ['friend'],
  radioGroupTest: 'friend',
  toggleTest: null,
}

export default function Home() {

  const [ dev, setDev ] = useState(false)

  useEffect(() => {
    if (UI_VIEW) setDev(true) 
    else window.location = '/404'
  }, [])

  const {
    register,
    setValue,
    getValues,
    formState: { isValid, errors },
    setError,
    handleSubmit,
  } = useForm({
    mode: 'all',
    defaultValues: initialLoginForm, 
  })

  const [isChecked, setIsChecked] = useState(true)
  const [isRadio, setIsRadio] = useState('')
  const [isCheckedGroup, setIsCheckedGroup] = useState(['upload'])
  const [isToggle, setIsToggle] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState(false)

  const router = useRouter()

  const atChangeCheckboxGroup = (val, checked) => {
    setIsCheckedGroup(prev => {
      if (checked === true) {
        return [...prev, val]
      } else {
        return prev.filter(item => item !== val)
      }
    })
  }

  const onSubmit = (data) => {

  }

  return dev && (
    <>
      <main className={classReader('mb-5')}>
        <div className={classReader('container')}>
          <Breadcrumbs options={BREADCRUMB} />
          <form className={classReader('p-2')} onSubmit={handleSubmit(onSubmit)}>
            <h3>【Form component】</h3>
            <Input
              name="inputTest"
              placeholder="請輸入"
              prependChild={<i className={classReader('icon icon-calendar icon-md')} />}
              appendChild={<i className={classReader('icon icon-search icon-md')} />}
              register={register}
              validate={FORM_VALIDATES.inputTest}
              clearable
              maxLength={22}
              dense
            />

            {/* selected 搭配 react hook form 時，暫時還是要帶 onChange 去改變值 */}
            <Select
              label="Select"
              name="selectTest"
              placeholder="請輸入"
              hint="內容長度需大於6"
              color="teal"
              options={SELECT_OPTIONS}
              register={register}
              validate={FORM_VALIDATES.selectTest}
              onChange={(name, val) => setValue(name, val)}
              clearable
              dense
              optionsDense
            />

            {/* <AutoComplete
                label="Select"
                name="select"
                placeholder="請輸入"
                hint="內容長度需大於6"
                type="text"
                value={testSelect}
                options={SELECT_OPTIONS}
                validate={FORM_VALIDATES.password}
                // prependChild={<i className={classReader('icon icon-calendar icon-md')} />}
                // appendChild={<i className={classReader('icon icon-search icon-md')} />}
                onChange={setTestSelect}
                clearable
                color="pink"
                // rounded
                dense
                optionsDense
              /> */}

            <Radio
              label="Battery too low (react hook form)"
              name="radioTest"
              value="friend"
              color="secondary"
              register={register}
              keepColor
            />

            <Radio
              label="Battery too low"
              name="radioTest"
              value="friend"
              color="orange"
              selection={isRadio}
              onChange={setIsRadio}
              keepColor
            />

            <br />

            <Checkbox
              label="Battery too low (react hook form)"
              name="checkTest"
              value="friend"
              color="pink"
              register={register}
              keepColor
            />

            <Checkbox
              label="Battery too low"
              name="checkTest2"
              value="money"
              checked={isChecked}
              color="primary"
              onChange={(value, checked) => setIsChecked(checked)}
              keepColor
            />

            {/* (react hook form) */}
            <CheckboxGroup
              name="checkGroupTest"
              options={CHECK_OPTIONS}
              register={register}
              keepColor
            />

            <CheckboxGroup
              name="checkGroupTest"
              options={CHECK_OPTIONS}
              selection={isCheckedGroup}
              onChange={atChangeCheckboxGroup}
              keepColor
            />

            <RadioGroup
              name="radioGroupTest"
              options={RADIO_OPTIONS}
              // selection={testRadio}
              register={register}
              row
            />

            <Toggle
              label="test toggle label (react hook form)"
              name="toggleTest"
              icon="settings"
              uncheckedIcon="account"
              register={register}
              keepColor
            />

            <Toggle
              label="test toggle label"
              value={isToggle}
              name="toggleTest2"
              icon="settings"
              uncheckedIcon="delete"
              onChange={setIsToggle}
              color="green"
              keepColor
            />

            <br />

            <Button
              label="submit"
              textColor="teal"
              type="submit"
              outline
            />
          </form>

          <hr />

          <div className={classReader('button-example')}>
            <h3>【Button component】</h3>
            <div className={classReader('py-2')}>
              <span className={classReader('pr-4')}>outline + icon:</span>
              <Button
                label="Click show Loading"
                textColor="dark"
                icon="eye"
                outline
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => -setIsLoading(false), 3000)
                }}
              />
            </div>

            <div className={classReader('py-2')}>
              <span className={classReader('pr-4')}>Modal component + flat + iconRight:</span>
              <Button
                className={classReader('mt-2')}
                label="Click show Modal"
                color="primary"
                iconRight="help"
                onClick={() => setPrompt(true)}
                flat
              />
            </div>
          </div>

          <hr />

          <div className={classReader('badge-example')}>
            <h3>【Badge component】</h3>
            <div className={classReader('py-2')}>
              <span>default: </span>
              <Badge color="orange" className={classReader('mr-2')}>即買即用</Badge>
            </div>

            <div className={classReader('py-2')}>
              <span>textColor: </span>
              <Badge color="primary" textColor="red" className={classReader('mr-2')}>館長推薦</Badge>
            </div>

            <div className={classReader('py-2')}>
              <span>rounded: </span>
              <Badge color="secondary" className={classReader('mr-2')} rounded>日本在地達人推薦</Badge>
            </div>

            <div className={classReader('py-2')}>
              <span>color + outline: </span>
              <Badge color="green" className={classReader('py-2 px-5 mr-2')} outline>
                <i className={classReader('icon icon-sms icon-green icon-sm mr-1')} />
                <span>台北市</span>
              </Badge>
            </div>

            <div className={classReader('py-2')}>
              <span>Button component + floating + rounded: </span>
              <Button
                className={classReader('mt-2 relative-position')}
                label="floating + rounded"
                size="sm"
                color="gray-4"
                unelevated
              >
                <Badge color="red" floating rounded></Badge>
              </Button>
            </div>
          </div>

          <hr />

          <div className={classReader('breadcrumbs-example')}>
            <h3>【Breadcrumbs component】</h3>
            <Breadcrumbs options={BREADCRUMB_OPTIONS} />
          </div>

          <hr />

          <Loading size="md" isLoading={isLoading} loadingText="This is a loading component" />

          <Modal
            prompt={prompt}
            className={classReader('m-2')}
            title="Dialog Title"
            onClose={() => setPrompt(false)}
            separator
            // persistent
            close
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Modal>
        </div>
      </main>
    </>
  )
}