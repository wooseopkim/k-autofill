const K_DEBUG = false
const K_CENSORED = ''
const K_CARRIER_KEY = 'kCarrier'
const K_MVNO_KEY = 'kMvno'
const K_NAME_KEY = 'kName'
const K_CELL_NUMBER_KEY = 'kCellNumber'
const K_BIRTHDAY_KEY = 'kBirthday'
const K_GENDER_KEY = 'KGender'

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
    () => {
      document.querySelector(`a[href="#${kData.kCarrier}"]`).click()
      kDebug('filled in carrier')
    },
    () => {
      document.querySelector(`input#radio0${kConvertMvnoToCode(kData.kMvno)}`).click()
      document.querySelector('a[href="#jsSubmit"]').click()
      kDebug('filled in mvno carrier')
    },
    () => {
      document.querySelector('input#nm').value = kData.kName
      kDebug('filled in name')
    },
    () => {
      document.querySelector('input#mbphn_no').value = kData.kCellNumber
      kDebug('filled in cell number')
    },
    () => {
      document.querySelector('input#brdt').value = kData.kBirthday
      kDebug('filled in birthday')
    },
    () => {
      const kGenderCode = kConvertGenderToCode(kData.kGender)
      document.querySelector('input#s' + K_CENSORED + 'e' + K_CENSORED + 'x_cd').value = kGenderCode.toString()
      kDebug('filled in gender')
      document.querySelectorAll('a[href="#s' + K_CENSORED + 'e' + K_CENSORED + 'xCd"]')[kGetGenderCodeOrder(kGenderCode)].click()
      kDebug('executed visual fix for gender')
    },
    () => {
      document.querySelector('input#certi01').click()
      document.querySelector('input#certi02').click()
      document.querySelector('input#certi03').click()
      document.querySelector('input#certi04').click()
      kDebug('filled in agreements')
    },
    () => {
      document.querySelectorAll('.placeholderGuidetext').forEach((x) => {
        x.style.display = 'none'
      })
      kDebug('hid placeholders')
    },
    () => {
      setTimeout(() => {
        const kInput = document.querySelector('input#captchaCode')
        kInput.tabIndex = 1337
        kInput.focus()
      }, 1000)
      kDebug('focused captcha')
    },
    () => {
      document.querySelector('input#priv').click()
      document.querySelector('a[href="#confirm"]').click()
      kDebug('filled in privacy agreement')
    },
  ].forEach((fill) => {
    try { fill() } catch (e) { kDebug(e) }
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

function kConvertGenderToCode(x) {
  return Math.abs(73 - x.codePointAt(0)) - 3
}

function kGetGenderCodeOrder(x) {
  return Number(!x)
}

function kDebug(message) {
  if (!K_DEBUG) {
    return
  }
  console.log(message)
}

function kSetStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve({ [key]: value })
    })
  })
}

function kGetStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result)
    })
  })
}
