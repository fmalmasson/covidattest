// import 'bootstrap/dist/css/bootstrap.min.css'

// import './main.css'

import { PDFDocument, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons'

// import './check-updates'
import { format, sub } from 'date-fns'
import pdfBase from '../static/certificate.pdf'

const $ = (...args) => document.querySelector(...args)

library.add(faEye, faFilePdf)

dom.watch()

// let year, month, day

const generateQR = async (text) => {
  try {
    const opts = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1
    }
    return await QRCode.toDataURL(text, opts)
  } catch (err) {}
}

const profiles = [
  {
    lastname: 'Malmasson',
    firstname: 'Fabien',
    birthday: '30/01/1984',
    lieunaissance: 'Fontenay-aux-roses',
    address: '66 rue de chateaulin',
    zipcode: '44000',
    town: 'Nantes'
  },
  {
    lastname: 'Autin',
    firstname: 'Sophie',
    birthday: '25/03/1987',
    lieunaissance: 'Fontenay-le-comte',
    address: '66 rue de chateaulin',
    zipcode: '44000',
    town: 'Nantes'
  }
]

// function pad(str) {
//   return String(str).padStart(2, '0')
// }

// function setDateNow(date) {
//   year = date.getFullYear()
//   month = pad(date.getMonth() + 1) // Les mois commencent à 0
//   day = pad(date.getDate())
// }

// document.addEventListener('DOMContentLoaded', setReleaseDateTime)

// function setReleaseDateTime() {
//   const loadedDate = new Date()
//   setDateNow(loadedDate)
//   const releaseDateInput = document.querySelector('#field-datesortie')
//   releaseDateInput.value = `${year}-${month}-${day}`

//   const hour = pad(loadedDate.getHours())
//   const minute = pad(loadedDate.getMinutes())

//   const releaseTimeInput = document.querySelector('#field-heuresortie')
//   releaseTimeInput.value = `${hour}:${minute}`
// }

function idealFontSize(font, text, maxWidth, minSize, defaultSize) {
  let currentSize = defaultSize
  let textWidth = font.widthOfTextAtSize(text, defaultSize)

  while (textWidth > maxWidth && currentSize > minSize) {
    textWidth = font.widthOfTextAtSize(text, --currentSize)
  }

  return textWidth > maxWidth ? null : currentSize
}

async function generatePdf(profile, reason, minutes) {
  const creationDate = new Date().toLocaleDateString('fr-FR')
  const creationHour = new Date()
    .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    .replace(':', 'h')

  const {
    lastname,
    firstname,
    birthday,
    lieunaissance,
    address,
    zipcode,
    town
  } = profile
  const datesortie = format(new Date(), 'dd/MM/yyyy')
  const heuresortie = minutes
    ? format(sub(new Date(), { minutes }), "HH'h'mm")
    : format(new Date(), "HH'h'mm")

  const data = [
    `Cree le: ${creationDate} a ${creationHour}`,
    `Nom: ${lastname}`,
    `Prenom: ${firstname}`,
    `Naissance: ${birthday} a ${lieunaissance}`,
    `Adresse: ${address} ${zipcode} ${town}`,
    `Sortie: ${datesortie} a ${heuresortie}`,
    `Motifs: ${reason}`
  ].join('; ')

  const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const page1 = pdfDoc.getPages()[0]

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size, font })
  }

  drawText(`${firstname} ${lastname}`, 123, 686)
  drawText(birthday, 123, 661)
  drawText(lieunaissance, 92, 638)
  drawText(`${address} ${zipcode} ${town}`, 134, 613)

  if (reason.includes('travail')) {
    drawText('x', 76, 527, 19)
  }
  if (reason.includes('courses')) {
    drawText('x', 76, 478, 19)
  }
  if (reason.includes('sante')) {
    drawText('x', 76, 436, 19)
  }
  if (reason.includes('famille')) {
    drawText('x', 76, 400, 19)
  }
  if (reason.includes('sport')) {
    drawText('x', 76, 345, 19)
  }
  if (reason.includes('judiciaire')) {
    drawText('x', 76, 298, 19)
  }
  if (reason.includes('missions')) {
    drawText('x', 76, 260, 19)
  }
  let locationSize = idealFontSize(font, profile.town, 83, 7, 11)

  if (!locationSize) {
    alert(
      'Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.'
    )
    locationSize = 7
  }

  drawText(profile.town, 111, 226, locationSize)

  if (reason !== '') {
    // Date sortie
    drawText(datesortie, 92, 200)
    drawText(heuresortie, 200, 201)
  }

  // Date création
  drawText('Date de création:', 464, 150, 7)
  drawText(`${creationDate} à ${creationHour}`, 455, 144, 7)

  const generatedQR = await generateQR(data)

  const qrImage = await pdfDoc.embedPng(generatedQR)

  page1.drawImage(qrImage, {
    x: page1.getWidth() - 170,
    y: 155,
    width: 100,
    height: 100
  })

  pdfDoc.addPage()
  const page2 = pdfDoc.getPages()[1]
  page2.drawImage(qrImage, {
    x: 50,
    y: page2.getHeight() - 350,
    width: 300,
    height: 300
  })

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

function downloadBlob(blob, fileName) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
}

// function getAndSaveReasons(reasons) {
//   const values = reasons.join('-')
//   localStorage.setItem('reasons', values)
//   return values
// }

// see: https://stackoverflow.com/a/32348687/1513045
function isFacebookBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera
  return ua.includes('FBAN') || ua.includes('FBAV')
}

if (isFacebookBrowser()) {
  $('#alert-facebook').value =
    "ATTENTION !! Vous utilisez actuellement le navigateur Facebook, ce générateur ne fonctionne pas correctement au sein de ce navigateur ! Merci d'ouvrir Chrome sur Android ou bien Safari sur iOS."
  $('#alert-facebook').classList.remove('d-none')
}

// function addSlash() {
//   $('#field-birthday').value = $('#field-birthday').value.replace(
//     /^(\d{2})$/g,
//     '$1/'
//   )
//   $('#field-birthday').value = $('#field-birthday').value.replace(
//     /^(\d{2})\/(\d{2})$/g,
//     '$1/$2/'
//   )
//   $('#field-birthday').value = $('#field-birthday').value.replace(/\/\//g, '/')
// }

// $('#field-birthday').onkeyup = function() {
//   const key = event.keyCode || event.charCode
//   if (key === 8 || key === 46) {
//     return false
//   } else {
//     addSlash()
//     return false
//   }
// }

const GeneratorService = {
  async generateAttest(users, reason, minutes) {
    const creationDate = new Date().toLocaleDateString('fr-CA')
    const creationHour = new Date()
      .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      .replace(':', '-')

    const profilesToUse = users.length > 0 ? users : profiles

    for (let i = 0; i < profilesToUse.length; i++) {
      const pdfBlob = await generatePdf(profilesToUse[i], reason, minutes)
      downloadBlob(
        pdfBlob,
        `${profilesToUse[i].firstname}-attestation-${creationDate}_${creationHour}.pdf`
      )
    }
  }
}

// $$('input').forEach((input) => {
//   const exempleElt = input.parentNode.parentNode.querySelector('.exemple')
//   if (input.placeholder && exempleElt) {
//     input.addEventListener('input', (event) => {
//       if (input.value) {
//         exempleElt.innerHTML = 'ex.&nbsp;: ' + input.placeholder
//       } else {
//         exempleElt.innerHTML = ''
//       }
//     })
//   }
// })

// const conditions = {
//   '#field-firstname': {
//     condition: 'length'
//   },
//   '#field-lastname': {
//     condition: 'length'
//   },
//   '#field-birthday': {
//     condition: 'pattern',
//     pattern: /^([0][1-9]|[1-2][0-9]|30|31)\/([0][1-9]|10|11|12)\/(19[0-9][0-9]|20[0-1][0-9]|2020)/g
//   },
//   '#field-lieunaissance': {
//     condition: 'length'
//   },
//   '#field-address': {
//     condition: 'length'
//   },
//   '#field-town': {
//     condition: 'length'
//   },
//   '#field-zipcode': {
//     condition: 'pattern',
//     pattern: /\d{5}/g
//   },
//   '#field-datesortie': {
//     condition: 'pattern',
//     pattern: /\d{4}-\d{2}-\d{2}/g
//   },
//   '#field-heuresortie': {
//     condition: 'pattern',
//     pattern: /\d{2}:\d{2}/g
//   }
// }

// Object.keys(conditions).forEach((field) => {
//   $(field).addEventListener('input', () => {
//     if (conditions[field].condition === 'pattern') {
//       const pattern = conditions[field].pattern
//       if ($(field).value.match(pattern)) {
//         $(field).setAttribute('aria-invalid', 'false')
//       } else {
//         $(field).setAttribute('aria-invalid', 'true')
//       }
//     }
//     if (conditions[field].condition === 'length') {
//       if ($(field).value.length > 0) {
//         $(field).setAttribute('aria-invalid', 'false')
//       } else {
//         $(field).setAttribute('aria-invalid', 'true')
//       }
//     }
//   })
// })

// function addVersion() {
//   document.getElementById(
//     'version'
//   ).innerHTML = `${new Date().getFullYear()} - ${process.env.VERSION}`
// }
// addVersion()

export default GeneratorService
