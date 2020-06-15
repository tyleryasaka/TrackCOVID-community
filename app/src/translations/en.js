const appName = process.env.REACT_APP_NAME

module.exports = {
  'translation': {
    'menuAboutButton': 'About',
    'menuAdminButton': 'Admin',
    'checkpointsTab': 'Checkpoints',
    'statusTab': 'Status',
    'welcomeMessage': `Welcome to ${appName}. To participate in the effort to track the spread of the SARS-COV-2 virus, please scan a checkpoint whenever you interact with others in a way that could transmit the virus.`,
    'joinCheckpointButton': 'Scan a Checkpoint',
    'noCameraPermissionMessage': "This app does not have permission to access your device's camera. Instead, you may take a picture of the QR code.",
    'takePictureButton': 'Take a picture',
    'backButton': 'Back',
    'joinSuccessfulMessage': 'You have joined the checkpoint successfully.',
    'scanErrorMessage': 'The QR code could not be read. Please try again.',
    'statusLoadingMessage': 'Loading your status...',
    'statusNegativeMessage': 'No transmission paths from infected individuals to you have been discovered at this time. However, everyone is at risk and individuals should follow the directives of the Public Health Authority, & local government.',
    'statusPositiveMessage': 'A possible transmission path from an infected individual to you has been discovered. You should take precautionary measures to protect yourself and others, according to the directives of the Public Health authority & local government.',
    'loadingMessage': 'Loading...',
    'standardRiskLevelMessage': 'clear',
    'elevatedRiskLevelMessage': 'elevated',
    'yourRiskLevelMessage': 'Your risk level',
    'aboutReportMessage': 'If you have received a positive test, you may download your recent checkpoints below and share this file with your doctor. This will warn those who may have been exposed of their increased risk. You will remain anonymous.',
    'downloadHistoryButton': 'Download checkpoints',
    'elevatedRiskAlertMessage': 'Your risk level is elevated.',
    'seeStatusTabMessage': 'See the status tab.'
  }
}
