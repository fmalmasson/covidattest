import { PDFDocument, StandardFonts } from 'pdf-lib'
import { format, sub } from 'date-fns'
import pdfBase from '../static/certificate.pdf'
import { generateQR } from './util'

const ys = {
  travail: 578,
  achats: 533,
  sante: 477,
  famille: 435,
  handicap: 396,
  sport_animaux: 358,
  convocation: 295,
  missions: 255,
  enfants: 211
}

async function generatePdf(profile, reasons, minutes) {
  const creationDate = new Date().toLocaleDateString('fr-FR')
  const creationHour = new Date()
    .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    .replace(':', 'h')

  const {
    lastname,
    firstname,
    birthday,
    placeofbirth,
    address,
    zipcode,
    city
  } = profile
  const datesortie = format(new Date(), 'dd/MM/yyyy')
  const heuresortie = minutes
    ? format(sub(new Date(), { minutes }), "HH'h'mm")
    : format(new Date(), "HH'h'mm")

  const data = [
    `Cree le: ${creationDate} a ${creationHour}`,
    `Nom: ${lastname}`,
    `Prenom: ${firstname}`,
    `Naissance: ${birthday} a ${placeofbirth}`,
    `Adresse: ${address} ${zipcode} ${city}`,
    `Sortie: ${datesortie} a ${heuresortie}`,
    `Motifs: ${reasons}`
  ].join(';\n ')

  const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // set pdf metadata
  pdfDoc.setTitle('COVID-19 - Déclaration de déplacement')
  pdfDoc.setSubject('Attestation de déplacement dérogatoire')
  pdfDoc.setKeywords([
    'covid19',
    'covid-19',
    'attestation',
    'déclaration',
    'déplacement',
    'officielle',
    'gouvernement'
  ])
  pdfDoc.setProducer('DNUM/SDIT')
  pdfDoc.setCreator('')
  pdfDoc.setAuthor("Ministère de l'intérieur")

  const page1 = pdfDoc.getPages()[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size, font })
  }

  drawText(`${firstname} ${lastname}`, 119, 696)
  drawText(birthday, 119, 674)
  drawText(placeofbirth, 297, 674)
  drawText(`${address} ${zipcode} ${city}`, 133, 652)

  reasons.split(', ').forEach((reason) => {
    drawText('x', 84, ys[reason], 18)
  })

  let locationSize = getIdealFontSize(font, profile.city, 83, 7, 11)

  if (!locationSize) {
    alert(
      'Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.'
    )
    locationSize = 7
  }

  drawText(profile.city, 105, 177, locationSize)
  drawText(`${datesortie}`, 91, 153, 11)
  drawText(`${heuresortie}`, 264, 153, 11)

  const generatedQR = await generateQR(data)

  const qrImage = await pdfDoc.embedPng(generatedQR)

  page1.drawImage(qrImage, {
    x: page1.getWidth() - 156,
    y: 100,
    width: 92,
    height: 92
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

function getIdealFontSize(font, text, maxWidth, minSize, defaultSize) {
  let currentSize = defaultSize
  let textWidth = font.widthOfTextAtSize(text, defaultSize)

  while (textWidth > maxWidth && currentSize > minSize) {
    textWidth = font.widthOfTextAtSize(text, --currentSize)
  }

  return textWidth > maxWidth ? null : currentSize
}

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

export default GeneratorService

const profiles = [
  {
    lastname: 'Malmasson',
    firstname: 'Fabien',
    birthday: '30/01/1984',
    lieunaissance: 'Fontenay-aux-roses',
    address: '66 rue de chateaulin',
    zipcode: '44000',
    city: 'Nantes'
  },
  {
    lastname: 'Autin',
    firstname: 'Sophie',
    birthday: '25/03/1987',
    lieunaissance: 'Fontenay-le-comte',
    address: '66 rue de chateaulin',
    zipcode: '44000',
    city: 'Nantes'
  }
]
