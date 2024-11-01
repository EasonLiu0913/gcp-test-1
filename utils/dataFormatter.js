import {
  dateFormat,
  dateTimeFormat,
  isAfterDate,
  isBeforeDate,
} from 'utils/date'
import { thousandthsFormat } from 'utils/valueFormat'
import { lastSegmentOfURL } from 'utils/util'

// 單一短網址拿到的是一個二維陣列，[[a, b, c, d], [e, f, g, h]...]
// 其中的a, b, c, d彼此有順序關係，是一個接著一個（接續導頁）
// 為了避免回傳的資料不是照著順序，這裡要透過 id, refId 來爬確定彼此的順序
export const getShortenerArrayBoundaryIndex = (arr) => {
  let [start, end] = [undefined, undefined]
  function iterator(target) {
    for (let i in arr) {
      if (arr[i].refId === target) {
        if (target === null) start = i
        end = i
        iterator(arr[i].id)
        break
      }
    }
  }
  iterator(null)
  return [start, end]
}

export const shortenerFormatter = (shortenerArray, page = 1) => {
  return shortenerArray?.map( (shortArr, index) => {
    // const [START_INDEX, DIST_INDEX] = getShortenerArrayBoundaryIndex(shortArr)
    const shortenerUrl = `https://${shortArr?.brandDomain}/${shortArr?.code}`

    return {
      index: (page - 1) * 10 + index + 1,
      main: {
        title: shortArr.title,
        destUrl: decodeURIComponent(shortArr.destUrl),
      },
      code: shortenerUrl,
      tags: shortArr.tags,
      expiryDate: {
        start: dateFormat(shortArr.createDate),
        end: dateFormat(shortArr.expiryDate),
      },
      createUserName: shortArr.createUserName,
      action: {
        id: shortArr.id,
        batchId: shortArr?.batchId,
        title: shortArr.title,
        shortenerUrl: decodeURIComponent(shortenerUrl),
        expired: isAfterDate(dateTimeFormat('now'), shortArr.expiryDate),
      },
    }
  }) ?? []
}

export const shortenerBatchFormatter = (shortenerArray, page = 1) => {
  return shortenerArray?.map( (shortArr, index) => {
    return {
      index: (page - 1) * 10 + index + 1,
      id: shortArr.id,
      batchName: shortArr.batchName,
      batchQuantity: shortArr.batchQuantity,
      createDate: dateFormat(shortArr.createDate),
      createUser: shortArr.createUserName,
      action: {
        id: shortArr.id,
        projectId: shortArr.id,
        batchName: shortArr.batchName,
      },
    }
  }) ?? []
}

export const shortenerOneOnOnFormatter = (shortenerArray, page = 1) => {
  return shortenerArray?.map( (shortArr, index) => {
    const shortenerUrl = `https://${shortArr?.brandDomain}/${shortArr?.code}`

    return {
      index: (page - 1) * 10 + index + 1,
      id: shortArr.id,
      campaignName: shortArr.campaignName,
      code: shortArr.code,
      main: {
        title: shortArr.title,
        destUrl: decodeURIComponent(shortArr.destUrl),
      },
      campaignStartDate: dateFormat(shortArr.campaignStartDate),
      expiryDate: {
        start: dateFormat(shortArr.createDate),
        end: dateFormat(shortArr.expiryDate),
      },
      createUserName: shortArr.createUserName,
      quantity: shortArr.quantity,
      action: {
        id: shortArr.id,
        pairInfoId: shortArr.pairInfoId,
        campaignName: shortArr.campaignName, 
        title: shortArr.title,
        shortenerUrl: decodeURIComponent(shortenerUrl),
        isStart: shortArr.isStart,
        isDownload: shortArr.isDownload,
        createUserId: shortArr.createUserId,
      },
    }
  }) ?? []
}

export const roleFormatter = (roleArray, page = 1) => {
  return roleArray?.map( (data, index) => {
    return {
      index: (page - 1) * 10 + index + 1,
      id: data.id,
      roleName: data.roleName,
      roleCode: data.roleCode,
      isCheckOther: data.isCheckOther,
      action: { id: data.id },
    }
  }) ?? []
}

export const applicationFormatter = (applicationArray, page = 1) => {
  return applicationArray?.map( (data, index) => {
    return {
      index: (page - 1) * 10 + index + 1,
      id: data.id,
      name: data.name,
      email: data.email,
      brandName: data.brandName,
      brandDomain: data.brandDomain,
      createDate: dateFormat(data.createDate),
      modifyDate: dateFormat(data.modifyDate),
      status: data.status,
      action: {
        id: data.id,
        name: data.name,
        email: data.email,
        status: data.status,
        brandDomain: data.brandDomain,
        brandName: data.brandName,
      },
    }
  }) ?? []
}

export const brandFormatter = (brandArray, page = 1) => {
  return brandArray?.map( (data, index) => {
    return {
      index: (page - 1) * 10 + index + 1,
      id: data.brandId,
      brandName: data.brandName,
      brandDomain: data.brandDomain,
      createDate: dateFormat(data.createDate),
      isEnabled: data.isEnabled,
      memberCount: thousandthsFormat(data.memberCount),
      action: {
        id: data.id,
        brandName: data.brandName, 
      },
    }
  }) ?? []
}

export const analysisEffectFormatter = (resultArray) => {
  return resultArray?.map( (data) => {
    data.realTimeClick = isNaN(data.realTimeClick) ? data.realTimeClick : thousandthsFormat(data.realTimeClick)
    return {
      main: {
        img: data.metaImage,
        imageUrl: data.imageUrl,
        title: data.title,
        shortUrl: decodeURIComponent(data.shortUrl),
      },
      tags: data.tags,
      destUrl: decodeURIComponent(data.destUrl),
      createKind: data.createKind,
      pairInfoId: data.pairInfoId,
      realTimeClick: data.realTimeClick,
      totalClick: {
        count: thousandthsFormat(data.totalClick),
        id: data.pairInfoId,
      },
    }
  })
}

export const analysisAudienceFormatter = (resultArray) => {
  return resultArray?.map( (data) => {
    return {
      main: {
        imageUrl: data.imageUrl,
        title: data.title,
        shortUrl: decodeURIComponent(data.shortUrl),
      },
      destUrl: decodeURIComponent(data.destUrl),
      createKind: data.createKind,
      totalClick: thousandthsFormat(data.totalClick),
      uniqueUsers: thousandthsFormat(data.uniqueUsers),
      action: { 
        code: lastSegmentOfURL(data.shortUrl),
        id: data.pairInfoId,
        createDate: dateFormat(data.createDate),
        uniqueUsers: data.uniqueUsers,
        labelDisabled: isBeforeDate(dateFormat('now'), dateFormat(data.createDate, 7)),
      },
    }
  })
}

export const allMemberFormatter = (memberArray, page = 1) => {
  return memberArray?.map( (data, index) => {
    return {
      index: (page - 1) * 10 + index + 1,
      memberName: data.memberName,
      memberId: data.memberId,
      company: data.company,
      email: data.email,
      roleName: data.roleName,
      projectName: data.projectName,
      isEnabled: data.isEnabled,
      action: {
        id: data.id,
        memberName: data.memberName,
        memberId: data.memberId,
        email: data.email,
        projectName: data.projectName,
        projectId: data.projectId,
        roleId: data.roleId,
        roleName: data.roleName,
        isEnabled: data.isEnabled,
      },
    }
  }) ?? []
}