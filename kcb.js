const K_DEBUG = false
const K_CENSORED = ''
const K_CARRIER_KEY = 'kCarrier'
const K_MVNO_KEY = 'kMvno'
const K_NAME_KEY = 'kName'
const K_CELL_NUMBER_KEY = 'kCellNumber'
const K_BIRTHDAY_KEY = 'kBirthday'
const K_GENDER_KEY = 'KGender'
const K_TIME_TO_WAIT_FOR_USER_CHANGES = 2000;

const kFormIsDetected = !!document.querySelector('form[name="authForm"]')

const kData = {
  kCarrier: kGetStorage(K_CARRIER_KEY),
  kMvno: kGetStorage(K_MVNO_KEY),
  kName: kGetStorage(K_NAME_KEY),
  kCellNumber: kGetStorage(K_CELL_NUMBER_KEY),
  kBirthday: kGetStorage(K_BIRTHDAY_KEY),
  kGender: kGetStorage(K_GENDER_KEY),
}

if (kFormIsDetected) {
  ;[
    async () => {
      const value = await kData.kCarrier
      setTimeout(() => {
        try {
          document.querySelector(`a[href="#${value}"]`).click()
          kDebug('filled in carrier', value)
        } catch (e) {
          kDebug(e)
        }
      }, K_TIME_TO_WAIT_FOR_USER_CHANGES)
    },
    async () => {
      document.querySelectorAll('.telecomSelect a').forEach((x) => {
        x.addEventListener('click', (_) => {
          const key = K_CARRIER_KEY
          const value = x.href.replace(/^.+#/, '')
          kSetStorage(key, value).then(kDebug)
        })
      })
    },
    async () => {
      const value = await kData.kMvno
      document.querySelector(`input#radio0${kConvertMvnoToCode(value)}`).click()
      setTimeout(() => {
        try {
          document.querySelector('a[href="#jsSubmit"]').click()
          kDebug('filled in mvno carrier', value)
        } catch (e) {
          kDebug(e)
        }
      }, K_TIME_TO_WAIT_FOR_USER_CHANGES)
    },
    async () => {
      document.querySelectorAll('.mvnoSelectBox input[type="radio"]').forEach((x) => {
        x.addEventListener('change', (e) => {
          const key = K_MVNO_KEY
          const value = kConvertOptionValueToMvno(e.target.value)
          kSetStorage(key, value).then(kDebug)
        })
      })
    },
    async () => {
      const value = await kData.kName
      document.querySelector('input#nm').value = value || ''
      kDebug('filled in name', value)
    },
    async () => {
      document.querySelector('input#nm').addEventListener('change', (e) => {
        const key = K_NAME_KEY
        const value = e.target.value
        kSetStorage(key, value).then(kDebug)
      })
    },
    async () => {
      const value = await kData.kCellNumber
      document.querySelector('input#mbphn_no').value = value || ''
      kDebug('filled in cell number', value)
    },
    async () => {
      document.querySelector('input#mbphn_no').addEventListener('change', (e) => {
        const key = K_CELL_NUMBER_KEY
        const value = e.target.value
        kSetStorage(key, value).then(kDebug)
      })
    },
    async () => {
      const value = await kData.kBirthday
      document.querySelector('input#brdt').value = value || ''
      kDebug('filled in birthday', value)
    },
    async () => {
      document.querySelector('input#brdt').addEventListener('change', (e) => {
        const key = K_BIRTHDAY_KEY
        const value = e.target.value
        kSetStorage(key, value).then(kDebug)
      })
    },
    async () => {
      const value = await kData.kGender
      const kGenderCode = kConvertGenderToCode(value)
      const inputSelector = 'input#s' + K_CENSORED + 'e' + K_CENSORED + 'x_cd'
      document.querySelector(inputSelector).value = kGenderCode.toString()
      kDebug('filled in gender', value)
      const anchorSelector = 'a[href="#s' + K_CENSORED + 'e' + K_CENSORED + 'xCd"]'
      const index = kConvertGenderCodeToIndex(kGenderCode)
      document.querySelectorAll(anchorSelector)[index].click()
      kDebug('executed visual fix for gender')
    },
    async () => {
      const anchorSelector = 'a[href="#s' + K_CENSORED + 'e' + K_CENSORED + 'xCd"]'
      document.querySelectorAll(anchorSelector).forEach((x, i) => {
        x.addEventListener('mousedown', (_) => {
          const key = K_GENDER_KEY
          const value = kConvertIndexToGender(i)
          kSetStorage(key, value).then(kDebug)
        })
      })
    },
    async () => {
      document.querySelector('input#certi01').click()
      document.querySelector('input#certi02').click()
      document.querySelector('input#certi03').click()
      document.querySelector('input#certi04').click()
      kDebug('filled in agreements')
    },
    async () => {
      document.querySelectorAll('.placeholderGuidetext').forEach((x) => {
        x.style.display = 'none'
      })
      kDebug('hid placeholders')
    },
    async () => {
      setTimeout(() => {
        try {
          const kInput = document.querySelector('input#captchaCode')
          kInput.tabIndex = 1337
          kInput.focus()
        } catch (e) {
          kDebug(e)
        }
      }, 1000)
      kDebug('focused captcha')
    },
    async () => {
      document.querySelector('input#priv').click()
      document.querySelector('a[href="#confirm"]').click()
      kDebug('filled in privacy agreement')
    },
  ].forEach((fill) => {
    fill().catch(kDebug)
  })
}

function kConvertMvnoToCode(x) {
  switch (x) {
    case 'kt':
      return 2
    case 'skt':
      return 1
    case 'lgu':
      return 3
  }
}

function kConvertOptionValueToMvno(x) {
  switch (x) {
    case '05':
      return 'kt'
    case '04':
      return 'skt'
    case '06':
      return 'lgu'
  }
}

function kConvertGenderToCode(x) {
  return Math.abs(73 - x.codePointAt(0)) - 3
}

function kConvertIndexToGender(x) {
  return String.fromCodePoint(70 + Number(!x) * 7)
}

function kConvertGenderCodeToIndex(x) {
  return Number(!x)
}

function kDebug(...messages) {
  if (!K_DEBUG) {
    return
  }
  console.log(...messages)
}

function kSetStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      kDebug('set', key, value)
      resolve({ [key]: value })
    })
  })
}

function kGetStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      kDebug('get', key, result)
      resolve(result[key])
    })
  })
}
