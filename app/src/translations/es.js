

const appName = process.env.REACT_APP_NAME



module.exports = {

  'translation': {

    'menuAboutButton': 'Sobre nos',

    'menuCheckpointButton': 'Punto de control',

    'menuAdminButton': 'Admin',

    'checkpointsTab': 'Puntos de control',

    'statusTab': 'Estado',

    'settingsTab': 'Configuración',

    'welcomeMessage': `Bienvenido a ${appName}. Para participar en el esfuerzo por rastrear la propagación del virus SARS-COV-2, escanee un punto de control cada vez que interactúe con otros de una manera que pueda transmitir el virus.`,

    'hostCheckpointButton': 'Alojar un punto de control',

    'joinCheckpointButton': 'Escanear un punto de control',

    'hostingCheckpointMessage': 'Ahora está alojando un punto de control. Otros pueden unirse usando el código QR a continuación.',

    'endCheckpointButton': 'Fin del punto de control',

    'printCheckpointButton': 'Impresión',

    'checkpointCreatedMessage': 'Punto de control creado',

    'noCameraPermissionMessage': "Esta aplicación no tiene permiso para acceder a la cámara de su dispositivo. En su lugar, puede tomar una foto del código QR.",

    'takePictureButton': 'Tome una foto',

    'backButton': 'Atrás',

    'joinSuccessfulMessage': 'Se ha unido al punto de control con éxito.',

    'scanErrorMessage': 'No se pudo leer el código QR. Inténtelo de nuevo.',

    'statusLoadingMessage': 'Cargando su estado...',

    'statusNegativeMessage': 'No se han descubierto rutas de transmisión de individuos infectados a usted en este momento. Sin embargo, todos están en riesgo y las personas deben seguir las directrices de la Autoridad de Salud Pública, y el gobierno local.',

    'statusPositiveMessage': 'Se ha descubierto una posible ruta de transmisión de un individuo infectado a usted. Usted debe tomar medidas de precaución para protegerse a sí mismo y a los demás, de acuerdo con las directivas de la autoridad de salud pública y el gobierno local.',

    'loadingMessage': 'Carga...',

    'standardRiskLevelMessage': 'normal',

    'elevatedRiskLevelMessage': 'Elevado',

    'yourRiskLevelMessage': 'Su nivel de riesgo',

    'aboutReportMessage': 'Si ha recibido una prueba positiva, puede descargar sus puntos de control recientes a continuación y compartir este archivo con su médico. Esto advertirá a aquellos que pueden haber estado expuestos de su mayor riesgo. Permanecerás en el anonimato.',

    'reportButton': 'Informe Anónimo',

    'downloadHistoryButton': 'Descargar puntos de control',

    'aboutConfirmationCodeMessage': '¿Tiene un código de confirmación para escanear? El escaneo de un código de confirmación ayudará a aquellos que puedan haber sido expuestos, haciéndoles saber que este es un riesgo legítimo.',

    'scanConfirmationCodeButton': 'Código de confirmación de escaneado',

    'scanWithoutConfirmationCodeButton': "No tengo un código",

    'reportConfirmationMessage': 'Esto notificará a aquellos que puedan haber estado expuestos de su mayor riesgo. Permanecerás en el anonimato. Esto no se puede deshacer.',

    'reportCompletedMessage': 'Su estado positivo fue reportado anónimamente. Aquellos en riesgo serán notificados. Gracias.',

    'cancelReportButton': 'Olvídalo',

    'confirmReportButton': 'Informe ahora',

    'aboutUseConfirmedDiagnoses': 'Al seleccionar "Usar solo diagnósticos confirmados" se omitirán las posibles rutas de transmisión de los informes no confirmados.',

    'useConfirmedDiagnosesButton': 'Usa solo diagnósticos confirmados',

    'elevatedRiskAlertMessage': 'Su nivel de riesgo es elevado.',

    'seeStatusTabMessage': 'Consulte la pestaña de estado.'

  }

}
