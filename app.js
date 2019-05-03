const pdfMakePrinter = require('pdfmake');
const path = require('path');
const fs = require('fs');

function createPdfBinary(entries, callback) {

    const pdfDoc = {
        content: [
            {
                layout: 'lightHorizontalLines', // optional
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: [ 'auto', 'auto', '*', '*', 'auto', '*', 'auto'],

                    body: [
                        [ 'Element', 'Title', 'Comment', 'Before Images', 'Status', 'After Image', 'Remarks'],
                        // [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
                    ]
                }
            }
        ]
    }

    entries.forEach(entry => {
        pdfDoc.content[0].table.body.push(
            [
                entry.element,
                entry.title,
                entry.comments,
                entry.images.map(image => {return {image: `data:application/pdf;base64,${image}`, width: 100}}),
                entry.status,
                entry.doneImages.map(image => {return {image: `data:application/pdf;base64,${image}`, width: 100}}),
                entry.remarks
            ]
        )
    })

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

module.exports = {
    createPdfBinary
}

// createPdfBinary(dd, (res) => {})