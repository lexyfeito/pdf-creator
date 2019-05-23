const pdfMakePrinter = require('pdfmake');
const path = require('path');
const fs = require('fs');

function createPdfBinary(project, entries, callback) {

    const pdfDoc = {
        header: { text: project.name, fontSize: 22, fontWeight: 'bold'},
        pageOrientation: 'landscape',
        content: [
            {
                layout: 'lightHorizontalLines', // optional
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 2,
                    // widths: [ 'auto', 'auto', '*', '*', '*', 'auto', 'auto'],
                    widths: [ 'auto', 'auto', '*', '*', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],

                    // two lines
                    // body: [
                    //     [ 'Item', 'Provided By', 'Location', 'LatLng', 'Element', 'Issue', 'Image'],
                    //     [ 'Item', 'Status', 'After Image', 'Remarks', '', '', '']
                    //     // [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
                    // ]

                    //one line
                    body: [
                        [ 'Item', 'Provided By', 'Location', 'LatLng', 'Element', 'Issue', 'Image', 'Status', 'After Image', 'Remarks'],
                        // [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
                    ]
                }
            }
        ]
    }

    // twoLiner(entries, pdfDoc)
    oneLiner(entries, pdfDoc)

    var fontDescriptors = {
        Roboto: {
            normal: path.join(__dirname, '/fonts/Roboto-Regular.ttf'),
            bold: path.join(__dirname, '/fonts/Roboto-Medium.ttf'),
            italics: path.join(__dirname, '/fonts/Roboto-Italic.ttf'),
            bolditalics: path.join(__dirname, '/fonts/Roboto-MediumItalic.ttf')
        }
    };

    const printer = new pdfMakePrinter(fontDescriptors);

    const doc = printer.createPdfKitDocument(pdfDoc);

    const chunks = [];
    let result;

    doc.on('data', function (chunk) {
        chunks.push(chunk);
    });

    // doc.pipe(
    //     fs.createWriteStream('filename.pdf').on("error", (err) => {
    //         errorCallback(err.message);
    //     })
    // );

    doc.on('end', function () {
        result = Buffer.concat(chunks);
        // callback('data:application/pdf;base64,' + result.toString('base64'));
        callback(result.toString('base64'));
    });

    doc.end();

}

function twoLiner(entries, pdfDoc) {
    var index = 1
    entries.forEach(entry => {
        pdfDoc.content[0].table.body.push(
            [
                index,
                entry.providedBy,
                entry.location,
                entry.coordinates,
                entry.element,
                entry.issue,
                entry.images.map(image => {return {image: `data:application/pdf;base64,${image}`, width: 100}}),
            ]
        )
        pdfDoc.content[0].table.body.push(
            [
                index,
                entry.status,
                entry.doneImages.map(image => {return {image: `data:application/pdf;base64,${image}`, width: 100}}),
                entry.remarks,
                '',
                '',
                ''
            ])
        index++
    })
}

function oneLiner(entries, pdfDoc) {
    var index = 1
    entries.forEach(entry => {
        pdfDoc.content[0].table.body.push(
            [
                index,
                entry.providedBy,
                entry.location,
                entry.coordinates,
                entry.element,
                entry.issue,
                entry.images.map(image => {return {image: `data:application/pdf;base64,${image}`, width: 100}}),
                entry.status,
                entry.doneImages.map(image => {return {image: `data:application/pdf;base64,${image}`, width: 100}}),
                entry.remarks,
            ]
        )
    })
}

module.exports = {
    createPdfBinary
}

// createPdfBinary(dd, (res) => {})