export function PdfViewer({pUrl}){

    return (
        <div style={{ height: '72rem' }}>
        <iframe
          title="PDF Viewer"
          src={pUrl}
          style={{ width: '100%', height:'100%'}}
        >
          This browser does not support PDFs. Please download the PDF to view it.
        </iframe>
      </div>
    )
}