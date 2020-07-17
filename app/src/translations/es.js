const appName = process.env.REACT_APP_NAME

module.exports = {
  'translation': {
    'menuAboutButton': 'Sobre',
    'menuAdminButton': 'Admin',
    'menuCheckpointButton': 'Punto de Chequeo',
    'checkpointsTab': 'Punto de Chequeo',
    'statusTab': 'Estado',
    'reportTab': 'Report',
    'slogan': 'Be safe and keep track.',
    'welcomeMessage': `Thank you for participating in the effort to reduce the spread of COVID-19. You may scan a checkpoint using the button below.`,
    'learnMoreText': `You may check your exposure status at any time through this web app. Learn more about ${appName} by visiting `,
    'joinCheckpointButton': 'Únase a un Punto de Chequeo',
    'noCameraPermissionMessage': "Esta app no tiene permiso para acceder a la cámara de su teléfono. En su lugar , Usted puede tomar una fotografía del código QR.",
    'takePictureButton': 'Tome una Fotografía',
    'backButton': 'Volver',
    'joinSuccessfulMessage': 'Se ha unido con éxito a un Punto de Chequeo.',
    'scanErrorMessage': 'El códifo QR no pudo ser creado, por favor intente nuevamente.',
    'statusLoadingMessage': 'Cargando su estado...',
    'statusNegativeMessage': 'No se encontrado ninguna vía de transmisión hacia Usted de individuos infectados hasta este momento. Sin embargo, todos estamos en riesgo y debemos seguir las guías del CDC ó de las autoridades Sanitarias locales, Provinciales - Estatales y Nacionales.',
    'statusPositiveMessage': 'Se ha encontrado una posible vía de trasmisión desde un individuo infectado hacia Ud. Debe tomar las medidas de precaución necesarias para protegerse y proteger a otros, de acuerdo a las directivas del CDC o de las autoridades Sanitarias locales, Provinciales o Estatales y Nacionales. Comuníquese telefónicamente.',
    'loadingMessage': 'Cargando...',
    'standardRiskLevelMessage': 'Estandard',
    'elevatedRiskLevelMessage': 'Elevado',
    'yourRiskLevelMessage': 'Su Nivel de Riesgo',
    'aboutReportMessage': 'In the event that you test positive for COVID-19, you may be given the opportunity to protect others by anonymously sharing your checkpoint history. You can download your checkpoint history file using the button below and share this with your doctor.',
    'downloadHistoryButton': 'Download checkpoints',
    'elevatedRiskAlertMessage': 'Su nivel de Riesgo es Elevado.',
    'seeStatusTabMessage': 'Mire la Barra de Estado.'
  }
}
