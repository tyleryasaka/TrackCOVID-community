const appName = process.env.REACT_APP_NAME

module.exports = {
  'translation': {
    'menuAboutButton': 'About',
    'menuAdminButton': 'Admin',
    'menuCheckpointButton': 'Checkpoint',
    'checkpointsTab': 'Checkpoints',
    'statusTab': 'Status',
    'reportTab': 'Report',
    'slogan': 'Be safe and keep track.',
    'welcomeMessage': `Thank you for participating in the effort to reduce the spread of COVID-19. You may scan a checkpoint using the button below.`,
    'learnMoreText': `You may check your exposure status at any time through this web app. Learn more about ${appName} by visiting `,
    'joinCheckpointButton': 'Scan a Checkpoint',
    'noCameraPermissionMessage': "This app does not have permission to access your device's camera. Instead, you may take a picture of the QR code.",
    'takePictureButton': 'Take a picture',
    'backButton': 'Back',
    'joinSuccessfulMessage': 'You have joined the checkpoint successfully.',
    'scanErrorMessage': 'The QR code could not be read. Please try again.',
    'statusLoadingMessage': 'Loading your status...',
    'statusNegativeMessage': 'At this time, no exposures have been detected. However, everyone is at risk, and you should follow the guidance of public health authorities.',
    'statusPositiveMessage': 'You may have been exposed to COVID-19. You should take precautionary measures to protect yourself and others, according to the guidance of public health authorities.',
    'loadingMessage': 'Loading...',
    'standardRiskLevelMessage': 'standard',
    'elevatedRiskLevelMessage': 'elevated',
    'yourRiskLevelMessage': 'Your risk level',
    'aboutReportMessage': 'In the event that you test positive for COVID-19, you may be given the opportunity to protect others by anonymously sharing your checkpoint history. You can download your checkpoint history file using the button below and share this with your doctor.',
    'downloadHistoryButton': 'Download checkpoints',
    'elevatedRiskAlertMessage': 'Your risk level is elevated.',
    'seeStatusTabMessage': 'See the status tab.'
  }
}
