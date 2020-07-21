const appName = process.env.REACT_APP_NAME

module.exports = {
  'translation': {
    'menuAboutButton': 'Sobre',
    'menuAdminButton': 'Admin',
    'menuCheckpointButton': 'Punto de Chequeo',
    'checkpointsTab': 'Punto de Chequeo',
    'statusTab': 'Estado',
    'reportTab': 'Reporte',
    'slogan': 'Cuídese y mantenga la trazabilidad.',
    'welcomeMessage': `Gracias por participar en el esfuerzo para reducir la diseminación de COVID-19. Ud. puede escanear un Punto de Cheuqoe usando el boton debajo.`,
    'learnMoreText': `Usted puede chequear su Estado de Exposición en cualquier momento a través de este sitio web. Aprenda más sobre esta aplicación ${appName} visitando `,
    'joinCheckpointButton': 'Únase a un Punto de Chequeo',
    'noCameraPermissionMessage': 'Esta app no tiene permiso para acceder a la cámara de su teléfono. En su lugar, Usted puede tomar una fotografía del código QR.',
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
    'aboutReportMessage': 'En el caso de que Usted tenga un resultado Positivo en un test de Covid-19, tiene la oportunidad de proteger a otros anónimamente compartiendo su historial de Puntos de Chequeos. Usted puede descargar su archivo con el Historial de contacto con Puntos de Chequeos usando el botón debajo y compartirlo con su médico ó el médico a cargo de la Aplicación localmente.',
    'downloadHistoryButton': 'Descargar Puntos de Chequeos',
    'elevatedRiskAlertMessage': 'Su nivel de Riesgo es Elevado.',
    'seeStatusTabMessage': 'Mire la Barra de Estado.'
  }
}
