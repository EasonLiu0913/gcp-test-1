import Head from 'next/head'
import classReader from 'utils/classReader'
import Stack from '@mui/material/Stack'
import Button from 'common/Button'
import { useSnackbar } from 'notistack'
import Input from 'common/form/Input'
import Card from 'common/card/Card'
import Select from 'common/form/Select'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  DatePicker, TimePicker, DateTimePicker, 
} from '@mui/x-date-pickers'
import Checkbox from 'common/form/Checkbox'
import Radio from 'common/form/Radio'
import React from 'react'
import RadioGroup from 'common/form/RadioGroup'
import { UI_VIEW } from 'config/config'

export default function Home() {
  const { enqueueSnackbar } = useSnackbar()

  const [ dev, setDev ] = useState(false)

  useEffect(() => {
    if (UI_VIEW) setDev(true) 
    else window.location = '/404'
  }, [])


  const handleSnackBar = (type) => {
    switch (type) {
    case 'ERROR':
      return enqueueSnackbar('This is an ERROR message!', { className: classReader('error bg-error-light') })
    case 'WARNING':
      return enqueueSnackbar('This is a WARNING message!', { className: classReader('warning bg-warning-light') })
    case 'INFO':
      return enqueueSnackbar('This is an INFO message!', { className: classReader('info bg-info-light') })
    case 'SUCCESS':
      return enqueueSnackbar('This is a SUCCESS message!', { className: classReader('success bg-success-light') })
    default:
      return false
    }
  }

  return dev && (<>
    <Head>
      <title>Hello world</title>
    </Head>

    <main className={classReader('d-flex flex-center flex-column')}>

      <Card className={classReader('w-70 p-4 mb-4')} border={true}>
        <h1 className={classReader('h1')}>typography</h1>
        <Stack direction="row" justifyContent="space-evenly" >
          <Stack>
            <div>
              <h1 className={classReader('h1')}>This is H1 sample text<br />這是一段H1範例文字</h1>
            </div>
            <div>
              <h2 className={classReader('h2')}>This is H2 sample text<br />這是一段H2範例文字</h2>
            </div>
            <div>
              <h3 className={classReader('h3')}>This is H3 sample text<br />這是一段H3範例文字</h3>
            </div>
            <div>
              <h4 className={classReader('h4')}>This is H4 sample text<br />這是一段H4範例文字</h4>
            </div>
            <div>
              <h5 className={classReader('h5')}>This is H5 sample text<br />這是一段H5範例文字</h5>
            </div>
            <div>
              <h6 className={classReader('h6')}>This is H6 sample text<br />這是一段H6範例文字</h6>
            </div>
          </Stack>
          <Stack>
            <div>
              <p className={classReader('text-big')}>This is a big size text<br />這是一段 放大 的範例文字<br />{'className="text-big"'}</p>
            </div>
            <div>
              <p>This is a normal size text<br />這是一段 一般大小 的範例文字</p>
            </div>
            <div>
              <p className={classReader('bold')}>This is a normal size bold text<br />這是一段 一般大小 加粗 的範例文字<br />{'className="bold"'}</p>
            </div>
            <div>
              <p className={classReader('text-small')}>This is a small size text<br />這是一段 縮小 的範例文字<br />{'className="text-small"'}</p>
            </div>
            <div>
              <p className={classReader('text-small bold')}>This is a small size bold text<br />這是一段 縮小 加粗 的範例文字<br />{'className="text-small bold"'}</p>
            </div>
          </Stack>
        </Stack>
      </Card>

      <Card className={classReader('w-70 p-4 mb-4')} border={true}>
        <h1 className={classReader('h1')}>Default Text</h1>
        <Stack sx={{ rowGap: 4 }}>
          <div className={classReader('text-primary')}>
            <div className={classReader('text-title')}>Text Primary</div>
            <p>className: text-primary</p>
          </div>
          <div className={classReader('text-secondary')}>
            <div className={classReader('text-title')}>Text Secondary</div>
            <p>className: text-secondary</p>
          </div>
          <div className={classReader('success')}>
            <div className={classReader('text-title')}>Success</div>
            <p>className: success</p>
          </div>
          <div className={classReader('info')}>
            <div className={classReader('text-title')}>Info</div>
            <p>className: info</p>
          </div>
          <div className={classReader('warning')}>
            <div className={classReader('text-title')}>Warning</div>
            <p>className: warning</p>
          </div>
          <div className={classReader('error')}>
            <div className={classReader('text-title')}>Error</div>
            <p>className: error</p>
          </div>
        </Stack>
      </Card>

      <Card className={classReader('w-70 p-4 mb-4')} border={true}>
        <h1 className={classReader('h1')}>Button</h1>
        <Stack gap={5}>
          <Stack direction="row">
            <Button size="xl">{'size="xl"'}</Button>
            <Button size="lg">{'size="lg"'}</Button>
            <Button size="md">{'size="md"'}</Button>
            <Button size="sm">{'size="sm"'}</Button>
          </Stack>
          <Stack direction="row">
            <Button outline>outline</Button>
            <Button flat>flat</Button>
            <Button>default</Button>
          </Stack>
          <Stack direction="row">
            <Button disabled>disabled</Button>
            <Button color="green">{'color="green"'}</Button>
            <Button color="red">{'color="red"'}</Button>
            <Button color="gray" textColor="text-primary">{'color="red" textColor="text-primary"'}</Button>
          </Stack>
          <Stack direction="row">
            <Button icon="add">{'icon="add"'}</Button>
            <Button iconRight="add">{'iconRight="add"'}</Button>
            <Button isLoading disabled>isLoading</Button>
            <Button round>round</Button>
          </Stack>
        </Stack>
      </Card>

      <Card className={classReader('w-70 p-4 mb-4')} border={true}>
        <h1 className={classReader('h1')}>Alert</h1>
        <Stack gap={5}>
          <Stack gap={2}>
            <Button onClick={() => handleSnackBar('ERROR')} color="error">Click me to trigger ERROR alert</Button>
            <Button onClick={() => handleSnackBar('WARNING')} color="warning">Click me to trigger WARNING alert</Button>
            <Button onClick={() => handleSnackBar('INFO')} color="info">Click me to trigger INFO alert</Button>
            <Button onClick={() => handleSnackBar('SUCCESS')} color="success">Click me to trigger SUCCESS alert</Button>
          </Stack>
          <Stack gap={2}>
          </Stack>
        </Stack>
      </Card>

      <Card className={classReader('w-70 p-4 mb-4')} border={true}>
        <h1 className={classReader('h1')}>Form Style</h1>
        <div style={{ color: 'red' }}>time picker 一直有些css 問題，晚點再回頭用</div>
        <Stack gap={2} direction="row">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack>
              <div>
                <div className={classReader('text-title')}>Text Input</div>
                <Input placeholder="Text Input"/>
              </div>
              <div>
                <div className={classReader('text-title')}>Select</div>
                <Select
                  options={[
                    {
                      label: 'Google',
                      value: 'google', 
                    },
                    {
                      label: 'Facebook',
                      value: 'facebook', 
                    },
                    {
                      label: 'Twitter',
                      value: 'twitter', 
                    },
                  ]}
                  placeholder="Select Input"
                />
              </div>
              {/*  用這些 Picker 記得外面要有 <LocalizationProvider /> 包住*/}
              <div>
                <div className={classReader('text-title')}>Time Picker</div>
                <DatePicker format="YYYY/MM/DD"/>
              </div>
              <div>
                <div className={classReader('text-title')}>Date Picker</div>
                <TimePicker format="HH:mm" ampm={false}/>
              </div>
              <div>
                <div className={classReader('text-title')}>Date Time Picker</div>
                <DateTimePicker format="YYYY/MM/DD HH:mm" ampm={false}/>
              </div>
            </Stack>

            <Stack>
              <div>
                <div className={classReader('text-title')}>Text Input Disable</div>
                <Input value="text input disabled" disabled/>
              </div>
              <div>
                <div className={classReader('text-title')}>Select Disable</div>
                <Select
                  value="google"
                  options={[
                    {
                      label: 'Google',
                      value: 'google', 
                    },
                    {
                      label: 'Facebook',
                      value: 'facebook', 
                    },
                    {
                      label: 'Twitter',
                      value: 'twitter', 
                    },
                  ]}
                  disabled
                />
              </div>
              <div>
                <div className={classReader('text-title')}>Time Picker</div>
                <DatePicker format="YYYY/MM/DD" disabled />
              </div>
              <div>
                <div className={classReader('text-title')}>Date Picker</div>
                <TimePicker format="HH:mm" ampm={false} disabled/>
              </div>
              <div>
                <div className={classReader('text-title')}>Date Time Picker</div>
                <DateTimePicker format="YYYY/MM/DD HH:mm" ampm={false} disabled/>
              </div>
            </Stack>
          </LocalizationProvider>
        </Stack>

        <Card className={classReader('p-4 mb-4')} border={true}>
          <h2>CheckBox</h2>
          <Stack direction="row" gap={2}>
            <Checkbox label="Item Text"/>
            <Checkbox label="Item Text" checked/>
            <Checkbox label="Item Text" disabled/>
            <Checkbox label="Item Text" disabled checked/>
          </Stack>
        </Card>

        <Card className={classReader('p-4 mb-4')} border={true}>
          <h2>Radio</h2>
          <Stack direction="row" gap={2}>
            <RadioGroup
              name="radioGroupTest"
              options={[
                {
                  label: 'Item 1',
                  value: '1', 
                },
                {
                  label: 'Item 2',
                  value: '2', 
                },
              ]}
              selection="2"
            />
            <RadioGroup
              name="radioGroupTest"
              options={[
                {
                  label: 'Item 3',
                  value: '3', 
                },
                {
                  label: 'Item 4',
                  value: '4', 
                },
              ]}
              selection="4"
              disabled
            />
          </Stack>
        </Card>
      </Card>

    </main>
  </>)
}
