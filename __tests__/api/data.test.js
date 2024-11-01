import memberApi from '../../apis/member'
const axios = require('axios')

describe('Index testing', () => {
  // test('Should render content correctly', () => {
  //   expect(true).toBe(true)
  // })
  let token
  test('Should login correctly', async () => {
    const response = await memberApi.login({
      email: '',
      accountWord: '',
    })

    token = response?.data
    console.log('response', response)
    expect(response.success).toBe(true)
  })

  test('Should get user data correctly', async () => {
    
    const NEXT_PUBLIC_API_ROOT = 'https://branddomain-backend-uat.azurewebsites.net/api'
    const res = await axios({
      method: 'get',
      url: `${NEXT_PUBLIC_API_ROOT}/Member/GetUser`,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
      },
      timeout: 180000, 
    })
    
    expect(res.data.success).toBe(true)
  })
  test('Should GetMember data correctly', async () => {
    const NEXT_PUBLIC_API_ROOT = 'https://branddomain-backend-uat.azurewebsites.net/api'
    const res = await axios.post(
      `${NEXT_PUBLIC_API_ROOT}/Project/GetMember`, {
        page: 1,
        pageSize: 10, 
      }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
        },
        timeout: 180000, 
      },
    )
    
    expect(res.data.success).toBe(true)
  })
})
